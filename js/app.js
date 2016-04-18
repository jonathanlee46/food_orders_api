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
                console.log(data["nonce"] + " from getNonce()");
                return data["nonce"];
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

        //change for new inputs
        this.model.on("change", this.render);

        //form button
        var inputName = $('#new-name');
        var inputFood = $('#new-food');

        //local form submit
        $('.submit-new').click(function(){
          that.inputRender(inputName.val(), inputFood.val(), that);
        })
    },

    render: function() {
        //test to see if collection populated
        console.log("number of orders on the bill is " + bill.length);

        //print contents to html
        for (var i = 0; i < bill.length; i++){
            var tempModel = bill.at(i);
            $("#post").append(tempModel.get("name") + " wants " + tempModel.get("food") + "<br>");
        }
    },

    inputRender: function(name, food, target){
        console.log("inputRender firing");
        $("#post").append(name + " wants " + food + "<br>");
        var nonce = target.model.getNonce();
        console.log(nonce + " from inputRender");
    }

    
});

//instances
var bill = new OrderCollection();
var order = new Order();
var app = new PostsView({
    // define the el where the view will render
    model: order,
    collection: bill,
    el: $('body')
});

console.log("app.js end");