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

            //remove p tag from the food string
            var modFood = newFood.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");

            //create model instance and store to collection
            var newOrder = new Order({name: newName, food: modFood, postId: postId, modelId: globalCounter});
            globalCounter++;

            bill.add(newOrder);  //hardcoded collection to store
        }
    },
});

// Define the collection
OrderCollection = Backbone.Collection.extend({
    model: Order,
    print: function(){
        for (var i = 0; i < this.length; i++){
            var tempModel = bill.at(i);
            console.log(tempModel.get("name"));
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

        //wipe the Loading... text
        $("#post").empty();

        //print contents to html
        for (var i = 0; i < bill.length; i++){
            var tempModel = bill.at(i);
            console.log(tempModel.attributes);
            $("#post").append("<div class='order' id=" + tempModel.get("modelId") + ">" + tempModel.get("name") + " wants " + tempModel.get("food") + "<button class='delete'>Delete</button></div><br>");
        }
    },

    renderLast: function(){
        var tempModel = bill.at(bill.length-1);
        $("#post").append("<div class='order' id=" + tempModel.get("modelId") + ">" + tempModel.get("name") + " wants " + tempModel.get("food"));
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

    //when the submit button is clicked:
    submitAction: function(){

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

    
});

//instances on load
var bill = new OrderCollection();
var initialOrder = new Order();

var app = new PostsView({
    // define the el where the view will render
    model: initialOrder,
    collection: bill,
    el: $('body')
});


//event handling
$('.submit-new').click(function(e){
    e.preventDefault();

    app.submitAction();
    app.renderLast();
})
$('.refresh-list').click(function(e){
    e.preventDefault();

    bill.reset();
    var newOrder = new Order();
    app.model = newOrder;
    app.render();
})
$('.order-board').on('click', '.delete', function(e){
    e.preventDefault();
    
    //remove the order from DOM
    var divId = $(this).closest("div").attr("id");  
    $(this).closest("div").remove();

    //remove the order from collection and backend
    app.removeOrder(divId);
})

console.log("app.js end");