(function(App) {
  /*******************************************
   *  LANDING VIEW                           *
   *******************************************/
  App.Views.Landing = Backbone.View.extend({
    initialize: function() {
      this.template = _.template($('#view-landing-template').html());
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },
  });
})(window.App);
