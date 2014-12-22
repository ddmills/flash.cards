(function(App) {
  /*******************************************
   *  DECK VIEW                              *
   *******************************************/
  App.Views.Viewer = Backbone.View.extend({
    template: _.template($('#view-viewer-template').html()),
    initialize: function(id) {
      this.model = new App.Models.Deck({ deck_id: id });
      this.listenToOnce(this.model, 'sync', this.render);
      this.subViews = {
        'cards' : new App.Views.ViewerCards({ collection: this.model.get('cards') })
      },
      this.model.fetch();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.subViews.cards.$el = this.$('.view-viewerCards-container');
      this.model.get('cards').fetch();
      return this;
    }
  });

  App.Views.ViewerCards = Backbone.View.extend({
    template: _.template($('#view-viewer-cards-template').html()),
    initialize: function() {
      this.listenToOnce(this.collection, 'sync', this.render);
    },
    render: function() {
      this.$el.html(this.template({ cards: this.collection.toJSON() }));
      return this;
    }
  });
})(window.App);