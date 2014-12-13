(function(root) {
  root.App = {
    Models      : {},
    Local       : {},
    Collections : {},
    Views       : {},
    Router      : {},
  }
})(window);

/* Method for tearing down a Backbone View */
Backbone.View.prototype.close = function() {
  /* remove DOM html associated with the View and any events
   * bound to the elements (this is done through jQuery) */
  this.remove();
  /* Unbind any events that this View triggers (usually via
   * this.trigger(...) */
  this.unbind();
  /* call custom Views onClose method to help with any extra
   * cleanup that might be needed. More specifically, any
   * events from Models or Collections */
  if (this.onClose) { this.onClose(); }
}

/* Router helper method to switch between views */
Backbone.Router.prototype.show = function(view) {
  /* close current view */
  if (this.view) { this.view.close(); }
  /* set new view and render it */
  this.view = view;
  this.view.render();
  /* set main html to view html */
  $('#main-content').html(this.view.el);
}

/* Fire events from Model and Collection when fetching */
_.each(['Model', 'Collection'], function(name) {
  var ctor = Backbone[name];
  var fetch = ctor.prototype.fetch;
  ctor.prototype.fetch = function() {
    this.trigger('fetch', this);
    return fetch.apply(this, arguments);
  }
});
