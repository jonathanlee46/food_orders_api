// Define the model
Order = Backbone.Model.extend({
    idAttribute:"_id", //id# accessor

    defaults:{
        name: 'Jack',
        food: 'Pizza',
    },

    // url: 'http://jl46.x10host.com/?json=1',
    url: 'http://jl46.x10host.com/wp-json/wp/v2/posts',

    //parse JSON response and add models to collection
    parse: function(response) {
        var postArray = response;
        console.log(postArray.length);
        var globalCounter = 0;

        for (var i = 0; i< postArray.length; i++){

            //get wp post contents
            var newName = postArray[i]["title"]["rendered"];  //name
            var newFood = postArray[i]["content"]["rendered"];  //order
            var postId  = postArray[i]["id"]; //WP post id
            var category = postArray[i]["categories"][0]; //post category

            //separate menu and orders
            if (category === 5){
                //remove p tag from the string
                var modFood = newFood.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");

                //create model instance and store to collection
                var newOrder = new Order({name: newName, menu: modFood, postId: postId});

                menu.add(newOrder);  //hardcoded collection to store
            }
            else{
                //remove p tag from the food string
                var modFood = newFood.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");

                //create model instance and store to collection
                var newOrder = new Order({name: newName, food: modFood, postId: postId, modelId: globalCounter});
                globalCounter++;

                bill.add(newOrder);  //hardcoded collection to store
            }
        }
    },
    getName: function(){
        return this.get("name");
    },
    getFood: function(){
        return this.get("food");
    },
    getPostId: function(){
        return this.get("postId");
    },
    getModelId: function(){
        return this.get("modelId");
    },
});

// Define the collection
OrderCollection = Backbone.Collection.extend({
    model: Order,
    print: function(){
        for (var i = 0; i < this.length; i++){
            var tempModel = bill.at(i);
            console.log(tempModel.getName());
        }
    },
})

// Define the View
PostsView = Backbone.View.extend({
    initialize: function() {

        //fetch using model, which will store to collection
        var that = this;
        this.model.fetch({
            success: function () {
                console.log("fetching"); //proof of fetch
                that.render(); //call render function
            }
        });
    },

    //render orders to page
    render: function() {

        //test to see if collection populated
        console.log("number of orders on the bill is " + bill.length);

        //wipe the loading text for menu
        if (menu.at(0)){


        var menuModel = menu.at(0);

        $("#menu-board").empty();

        //print menu to menu board

        var restName = menuModel.getName();
        var menuUrl = menuModel.get("menu");
        $("#menu-board").append("Today we'll be eating at " + "<a href='" + menuUrl + "' target='_blank'>" + restName + "!</a> <button class='delete'>Delete</button></div><br>"); //implants menu URL into the link, target=_blank opens a new tab on click

}
        //wipe the Loading... text for orders
        $("#order-board").empty();

        //print orders to orders board
        for (var i = 0; i < bill.length; i++){
            var tempModel = bill.at(i);
            console.log(tempModel.attributes);
            $("#order-board").append("<div class='order' id=" + tempModel.get("modelId") + ">" + tempModel.getName() + " wants " + tempModel.getFood() + "<button class='delete'>Delete</button></div><br>");
        }
    },

    renderLastOrder: function(){
        var tempModel = bill.at(bill.length-1);
        $("#order-board").append("<div class='order' id=" + tempModel.get("modelId") + ">" + tempModel.get("name") + " wants " + tempModel.get("food"));
    },

    renderLastMenu: function(){
        var tempModel = menu.at(0);
        $("#menu-board").empty();

        var restName = tempModel.get("name");
        var menuUrl = tempModel.get("menu");
        $("#menu-board").append("Today we'll be eating at " + "<a href='" + menuUrl + "' target='_blank'>" + restName + "!</a> <button class='delete'>Delete</button></div>");
    },

    refresh: function(){
        //wipe the list
        $("#post").empty();

        //fetch list from backend and render
        var that = this;
        this.model.fetch({
            success: function () {
                console.log("fetching"); //proof of fetch
                that.render(); //call render function
            }
        });
    },

    //when the menu submit button is clicked:
    submitMenu: function(){

        //target form
        var inputName = $('#rest-name');
        var inputUrl = $('#rest-link');

        //create temp model and add to menu collection
        var submitMenu = new Order({name: inputName.val(), menu: inputUrl.val()});
        menu.add(submitMenu);

        //send model to WP POST
        $.ajax({
                url: 'http://jl46.x10host.com/wp-json/wp/v2/posts',
                headers: {
                    'Authorization':'Basic am9uYXRoYW5sZWU0NkBnbWFpbC5jb206R2YxWiBBZDNMIGh0MXQgOElNdQ=='
                },
                type: 'POST',
                data: {"title":inputName.val(), "content": inputUrl.val(), "categories": [5]}, 
                success: function (data) {
                    console.log("Successfully posted to backend");
                }
            });
    },

    //when the order submit button is clicked:
    submitOrder: function(){

        //target form button
        var inputName = $('#new-name');
        var inputFood = $('#new-food');

        //create temp model and add to collection
        var submitOrder = new Order({name: inputName.val(), food: inputFood.val()});
        this.collection.add(submitOrder);

        //send model to WP POST
        $.ajax({
            url: 'http://jl46.x10host.com/wp-json/wp/v2/posts',
            headers: {
                'Authorization':'Basic am9uYXRoYW5sZWU0NkBnbWFpbC5jb206R2YxWiBBZDNMIGh0MXQgOElNdQ=='
            },
            type: 'POST',
            data: {"title":inputName.val(), "content": inputFood.val()},
                success: function (data) {
                    //data
                    console.log("Successfully posted to backend");
            }
        });

        console.log("saving " + submitOrder.get("name") + ", " + submitOrder.get("food") + " to collection");
    },
    removeOrder: function(divId){
        var modelId = divId;
        console.log("removing " + modelId);

        var postId = bill.at(modelId).get("postId").toString();
        console.log(postId);

        var postUrl = "http://jl46.x10host.com/wp-json/wp/v2/posts/" + postId;
        console.log(postUrl);

        //remove order from wordpress
        $.ajax({
                url: postUrl,
                headers: {
                    'Authorization':'Basic am9uYXRoYW5sZWU0NkBnbWFpbC5jb206R2YxWiBBZDNMIGh0MXQgOElNdQ=='
                },
                type: 'delete',
                data: {},
                success: function (data) {
                    console.log("post deleted");
                }
        });

        //remove order model from collection
        bill.remove(bill.at(modelId));
        // bill.print();
    },
    removeMenu: function(){
        var postId = menu.at(0).get("postId").toString();
        var postUrl = "http://jl46.x10host.com/wp-json/wp/v2/posts/" + postId;

        //remove order from wordpress
        $.ajax({
                url: postUrl,
                headers: {
                    'Authorization':'Basic am9uYXRoYW5sZWU0NkBnbWFpbC5jb206R2YxWiBBZDNMIGh0MXQgOElNdQ=='
                },
                type: 'delete',
                data: {},
                success: function (data) {
                    console.log("post deleted");
                }
        });
    },

    
});

//instances on load
var bill = new OrderCollection();
var menu = new OrderCollection();
var initialOrder = new Order();

var app = new PostsView({
    // define the el where the view will render
    model: initialOrder,
    collection: bill,
    el: $('body')
});


//event handling
$('.submit-menu').click(function(e){
    e.preventDefault();

    app.submitMenu();
    app.renderLastMenu();
})
$('.submit-order').click(function(e){
    e.preventDefault();

    app.submitOrder();
    app.renderLastOrder();
})
$('.refresh-list').click(function(e){
    e.preventDefault();

    bill.reset();
    var newOrder = new Order();
    app.model = newOrder;
    app.render();
})
$('#order-board').on('click', '.delete', function(e){
    e.preventDefault();
    
    //remove the order from DOM
    var divId = $(this).closest("div").attr("id");  
    $(this).closest("div").remove();

    //remove the order from collection and backend
    app.removeOrder(divId);
})
$('#menu-board').on('click', '.delete', function(e){
    e.preventDefault();

    var divId = $(this).closest("div").attr("id");  
    $("#menu-board").empty();
    $("#menu-board").html("Deleted.  Add a new menu above!");

    app.removeMenu();
})

console.log("app.js end"); //test