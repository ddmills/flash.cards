(function(App) {
  /*******************************************
   *  DECK VIEW                              *
   *******************************************/
  App.Views.Viewer = Backbone.View.extend({
    template: _.template($('#view-viewer-template').html()),
    initialize: function(id) {
      this.model = new App.Models.Deck({ deck_id: id });
      this.listenTo(this.model, 'sync', this.render);
      this.subViews = {
        cards  : new App.Views.ViewerCards({ collection: this.model.get('cards') }),
        header : new App.Views.ViewerHeader({ model: this.model })
      },
      this.model.fetch();
      this.model.get('cards').fetch();
    },
    render: function() {
      console.log('rendering main');
      this.$el.html(this.template());
      this.subViews.cards.$el  = this.$('.view-viewerCards-container');
      this.subViews.header.$el = this.$('.view-viewerHeader-container');
      _.invoke(this.subViews, 'render');
      return this;
    }
  });
  App.Views.ViewerHeader = Backbone.View.extend({
    template: _.template($('#view-viewer-header-template').html()),
    initialize: function() {
      this.listenToOnce(this.model, 'sync', this.render);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  App.Views.ViewerCards = Backbone.View.extend({
    template: _.template($('#view-viewer-cards-template').html()),
    initialize: function() {
      this.listenTo(this.collection, 'sync', this.render);
    },
    render: function() {
      console.log('rendering cards');
      this.$el.html(this.template({ cards: this.collection.toJSON() }));
      return this;
    }
  });
})(window.App);