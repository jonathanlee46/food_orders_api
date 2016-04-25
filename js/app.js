// Define the model
Order = Backbone.Model.extend({
    defaults:{
        name: 'Jack',
        food: 'Pizza'
    },

    // url: 'http://jl46.x10host.com/?json=1',
    url: 'http://jl46.x10host.com/wp-json/wp/v2/posts',

    //parse JSON response and add models to collection
    parse: function(response) {
        var postArray = response;
        console.log(postArray.length);

        for (var i = 0; i< postArray.length; i++){

            //get wp post contents
            var newName = postArray[i]["slug"];  //name
            var newFood = postArray[i]["content"]["rendered"];  //order

            //remove p tag from the food string
            var modFood = newFood.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");

            //create model instance and store to collection
            var newOrder = new Order({name: newName, food: modFood});

            bill.add(newOrder);  //hardcoded collection to store
        }
    },

});

// Define the collection
OrderCollection = Backbone.Collection.extend({
    model: Order,
    url: 'http://jl46.x10host.com/?json=1',
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
            $("#post").append(tempModel.get("name") + " wants " + tempModel.get("food") + "<br>");
        }
    },

    renderLast: function(){
        var tempModel = bill.at(bill.length-1);
        $("#post").append(tempModel.get("name") + " wants " + tempModel.get("food") + "<br>");
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
        var appPass = btoa("jonathanlee46@gmail.com:Gf1Z Ad3L ht1t 8IMu");
        console.log(appPass);
        $.ajax({
            url: 'http://jl46.x10host.com/wp-json/wp/v2/posts',
            headers: {
                'Authorization':'Basic am9uYXRoYW5sZWU0NkBnbWFpbC5jb206R2YxWiBBZDNMIGh0MXQgOElNdQ=='
            },
            type: 'POST',
            data: {"title":inputName.val(), "content": inputFood.val()},
                success: function (data) {
                    //data
                    console.log("neat");
            }
        });

        console.log("saving " + submitOrder.get("name") + ", " + submitOrder.get("food") + " to collection");
    }

    
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
$('.submit-new').click(function(){
    app.submitAction();
    app.renderLast();
})

console.log("app.js end");