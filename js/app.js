// Define the model
Post = Backbone.Model.extend({
    defaults: {
        title: "here's a title",
        id: 999
    }
});

// Define the collection
Posts = Backbone.Collection.extend(
{
    model: Post,
    // Url to request when fetch() is called
    // url: 'http://jl46.x10host.com/?json=1',
    url: 'http://enigmatic.x10host.com/?json=1',
    // Overwrite the sync method to pass over the Same Origin Policy
    parse: function(response) {
        var postArray = response["posts"];
        console.log(postArray);
        for (var i = 0; i< postArray.length-1; i++){
            console.log(postArray[i]);
            this.add(postArray[i]);
        }
        return this;
    }
});


// Define the View
PostsView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');

        this.collection = new Posts();
        var that = this;
        this.collection.fetch({
            success: function () {
                console.log("fetching");
                that.render();
            }
        });
    },
    // Use an extern template

    render: function() {
        // Fill the html with the template and the collection
        $(this.el).append("<br>hello world");
        $(this.el).append(this.collection);
        $(this.el).append("<br>end");
    }
});

var app = new PostsView({
    // define the el where the view will render
    el: $('body')
});