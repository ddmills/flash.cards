(function(App) {
  /*******************************************
   *  BROWSE DECK VIEW                       *
   *******************************************/
  App.Views.Browse = Backbone.View.extend({
    template: _.template($('#view-browse-template').html()),
    initialize: function() {
      this.collection = new App.Collections.BrowseDecks;
      this.listenTo(this.collection, 'sync', this.render);

      this.subViews = {
        'searchToolbar' : new App.Views.BrowseToolbar(),
        'searchSidebar' : new App.Views.BrowseSidebar(),
        'searchResults' : new App.Views.BrowseResults({ collection: this.collection})
      };


      this.collection.fetch();
    },



    events: {
      'click #view-button': 'view'
    },

    view: function(event) {
    },

    loaded: function() {
      this.render();
    },

    loading: function() {
      this.model.set('loaded', false);
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      this.subViews.searchToolbar.$el = this.$('#view-browse-toolbar');
      this.subViews.searchSidebar.$el = this.$('#view-browse-sidebar');
      this.subViews.searchResults.$el = this.$('#view-browse-results');

      _.invoke(this.subViews, 'render');


      this.delegateEvents();
      return this;
    },

    onClose: function() {

    }
  });
  
  App.Views.BrowseToolbar = Backbone.View.extend({
    template: _.template($('#view-browse-toolbar-template').html()),
    initialize: function() {
      
    },
    render: function() {

      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }

  });
  App.Views.BrowseSidebar = Backbone.View.extend({
    template: _.template($('#view-browse-sidebar-template').html()),
    initialize: function() {
      
    },
    render: function() {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }

  });
  App.Views.BrowseResults = Backbone.View.extend({
    template: _.template($('#view-browse-results-template').html()),
    initialize: function() {
      this.subViews = {};
    },
    render: function() {
      var self = this;
      this.$el.html(this.template());

      var fragment = document.createDocumentFragment();

      _.each(this.collection.toArray(), function(deck) {
        var deckView = new App.Views.BrowseResult({
          model: deck,
          el: $('<div class="browse-result-bank"></div>')
        });
        self.subViews[deck.get('deck_id')] = deckView;
        fragment.appendChild(deckView.render().el);
      });

      this.$('.view-browse-results-container').html(fragment);

      this.delegateEvents();
      return this;
    }

  });
  App.Views.BrowseResult = Backbone.View.extend({
    template: _.template($('#view-browse-result-template').html()),
    initialize: function() {

    },
    events: {
      'click .view-browse-deck-view-btn': 'viewDeck'
    },
    viewDeck: function(e) {
      console.log(e);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }
  });

})(window.App);