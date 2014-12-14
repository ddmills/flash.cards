(function(App) {
  /*******************************************
   *  RESTRICTED DECK EDIT VIEW              *
   *******************************************/
  Restricted = Backbone.View.extend({
    template: _.template($('#view-restricted-template').html()),
    render: function() { this.$el.html(this.template()); }
  });
})(window.App);
