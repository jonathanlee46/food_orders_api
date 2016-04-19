// Define the model
Order = Backbone.Model.extend({
    defaults:{
        name: 'Jack',
        food: 'Pizza'
    },

    url: 'http://jl46.x10host.com/?json=1',

    //parse JSON response and add models to collection
    parse: function(response) {
        var postArray = response["posts"];

        for (var i = 0; i< postArray.length; i++){

            //get wp post contents
            var newName = postArray[i]["title"];
            // console.log(newName);
            var newFood = postArray[i]["content"];
            // console.log(newOrder);

            //remove p tag from the food string
            modFood = newFood.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");

            //create model instance and store to collection
            var newOrder = new Order({name: newName, food: modFood});
            // console.log(newOrder.get("name"));

            bill.add(newOrder);  //hardcoded collection to store
        }
    },

    //get nonce token to post to WP api
    getNonce: function(){
        $.ajax({
            url: 'http://jl46.x10host.com/api/get_nonce/?controller=posts&method=create_post',
            type: 'GET',
            data: {},
            success: function (data) {
                var nonce = data["nonce"]
                console.log(nonce + " from getNonce()");
                return nonce;
            }
        });

    }
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

        //collection listener to refresh posts
        // this.collection.on('add', this.renderNew());
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