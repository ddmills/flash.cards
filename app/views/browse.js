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
      this.delegateEvents();
      return this;
    },

    onClose: function() {
    }
  });
})(window.App);