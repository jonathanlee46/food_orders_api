// // Define the model
Order = Backbone.Model.extend({
    defaults:{
        name: 'Jack',
        food: 'Pizza'
    },

    url: 'http://jl46.x10host.com/?json=1',

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
    },

    //render orders to page
    render: function() {
        //test to see if collection populated
        console.log("number of orders on the bill is " + bill.length);

        //print contents to html
        for (var i = 0; i < bill.length; i++){
            var tempModel = bill.at(i);
            $("#post").append(tempModel.get("name") + " wants " + tempModel.get("food") + "<br>");
        }
    },

    //when the submit button is clicked:
    inputAction: function(){
        //collection listener to refresh posts
        this.collection.on('add', this.render);

        //clear posts
        $("#post").empty();

        //target form button
        var inputName = $('#new-name');
        var inputFood = $('#new-food');

        //create temp model and add to collection
        var submitOrder = new Order({name: inputName.val(), food: inputFood.val()});
        this.collection.add(submitOrder);

        console.log("saving " + submitOrder.get("name") + ", " + submitOrder.get("food") + " to collection");
    }

    
});

//instances
var bill = new OrderCollection();
var initialOrder = new Order();
var app = new PostsView({
    // define the el where the view will render
    model: initialOrder,
    collection: bill,
    el: $('body')
});

$('.submit-new').click(function(){
    app.inputAction();
})
console.log("app.js end");