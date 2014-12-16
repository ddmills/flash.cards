(function(App) {
  /*******************************************
   *  BROWSE DECK VIEW                       *
   *******************************************/
  App.Views.Browse = Backbone.View.extend({
    template: _.template($('#view-browse-template').html()),
    initialize: function() {
      this.model = new App.Collections.BrowseDecks;
      console.log(this.model);
      this.listenTo(this.model, 'sync', this.render);

      this.subViews = {
        'searchToolbar' : new App.Views.BrowseToolbar(this.model),
        'searchSidebar' : new App.Views.BrowseSidebar(this.model),
        'searchResults' : new App.Views.BrowseResults(this.model)
      };


      this.model.fetch();
    },



    events: {
      'click #submit-browse-deck': 'submit'
    },

    loaded: function() {
      this.model.set('loaded', true);
      this.model.get('cards').fetch();
      this.render();
    },

    loading: function() {
      this.model.set('loaded', false);
      this.render();
    },

    render: function() {
      console.log(this.model.toJSON());
      this.$el.html(this.template({ decks: this.model.toJSON() }));
      this.subViews.searchToolbar.$el = this.$('#view-browse-toolbar');
      this.subViews.searchSidebar.$el = this.$('#view-browse-sidebar');
      this.subViews.searchResults.$el = this.$('#view-browse-results');

      _.each(this.subViews, function(v) { v.render(); });


      this.delegateEvents();
      return this;
    },

    onClose: function() {
    }
  });
  
  App.Views.BrowseToolbar = Backbone.View.extend({
    template: _.template($('#view-browse-toolbar-template').html()),
    initialize: function(model) {
      this.model = model;
    },
    render: function() {

      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }

  });
  App.Views.BrowseSidebar = Backbone.View.extend({
    template: _.template($('#view-browse-sidebar-template').html()),
    initialize: function(model) {
      this.model = model;
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }

  });
  App.Views.BrowseResults = Backbone.View.extend({
    template: _.template($('#view-browse-results-template').html()),
    initialize: function(model) {

      this.model = model;
    },
    render: function() {
      console.log(this.model.toJSON());
      this.$el.html(this.template({'decks': this.model.toJSON()}));
      this.delegateEvents();
      return this;
    }

  });
  

})(window.App);