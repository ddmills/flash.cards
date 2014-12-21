(function(App) {
  /*******************************************
   *  DECK VIEW                              *
   *******************************************/
  App.Views.Viewer = Backbone.View.extend({
    template: _.template($('#view-viewer-template').html()),
    initialize: function(id) {
      this.model = new App.Models.Deck({ deck_id: id });
      this.listenTo(this.model, 'sync', function() { console.log('fetched'); });
      this.model.fetch();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON));
      return this;
    }
  });
})(window.App);