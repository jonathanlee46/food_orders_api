// Define the model
Post = Backbone.Model.extend({
    // urlRoot : 'test.json',
    urlRoot: 'http://jl46.x10host.com/?json=1',
      parse: function(response) {
          console.log(response);
          return response;
      }
});

// Define the collection
Posts = Backbone.Collection.extend(
    {
        model: Post,
        // Url to request when fetch() is called
        // url: 'http://jl46.x10host.com/?json=1',
        url: 'http://enigmatic.x10host.com/?json=1',
        parse: function(response) {
            return response;
        },
        Overwrite the sync method to pass over the Same Origin Policy
        sync: function(method, model, options) {
            var that = this;
                var params = _.extend({
                    type: 'GET',
                    dataType: 'json',
                    url: that.url,
                    processData: false
                }, options);

            return $.ajax(params);
        }
    });

// Define the View
PostsView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render');

      this.collection = new Posts;

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