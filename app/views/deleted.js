(function(App) {
  App.Views.Deleted = Backbone.View.extend({
    template: _.template($('#view-deleted-template').html()),
    render: function() {
      this.$el.html(this.template());
    }
  });
})(window.App);