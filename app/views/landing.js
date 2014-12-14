(function(App) {
  /*******************************************
   *  LANDING VIEW                           *
   *******************************************/
  App.Views.Landing = Backbone.View.extend({
    template: _.template($('#view-landing-template').html()),
    render: function() {
      this.$el.html(this.template());
      return this;
    },
  });
})(window.App);
