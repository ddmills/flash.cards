(function(App) {
  var Router = Backbone.Router.extend({
    routes: {
      'create'        : 'create',
      'edit/:id'      : 'edit',
      'search/:query' : 'search',
      'browse'        : 'browse',
      'deleted'       : 'deleted',
      'local'         : 'local',
      ''              : 'landing',
      '*path'         : 'error',
    },

    landing: function() {
      this.show(new App.Views.Landing);
    },

    create: function() {
      this.show(new App.Views.Create);
    },

    edit: function(id) {
      if (App.Local.hasDeck(id)) {
        this.show(new App.Views.Editor(id));
      } else {
        this.show(new App.Views.Restricted(id));
      }
    },

    search: function(query) {
      console.log('you searched for ' + query);
    },

    browse: function() {
      this.show(new App.Views.Browse);
      console.log('browsin');
    },

    local: function() {
      console.log('local decks');
    },

    deleted: function() {
      this.show(new App.Views.Deleted);
    },

    error: function(path) {
      console.log('route not handled. ' + path);
    }
  });

  App.Router = new Router;
  Backbone.history.start();
})(window.App);
