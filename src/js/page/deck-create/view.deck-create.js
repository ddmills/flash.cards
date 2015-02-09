app.define.view ('create_deck_view', ['loader_view'], function (loader_view, model) {
  var api, container, template, model, loader, events;

  template = _.getTemplate ('#tmp-deck-create');
  container = $ ('#local-view');
  loader = new loader_view ({ icon: 'spinner' });

  events = {
    submitted : {
      name: 'click',
      target: '#deck-create-submit',
    }
  };

  api = {
    show_loader: function() {
      loader.replace (container);
    },

    hide_loader: function () {
      container.html (template (model));
    },

    render: function () {
      container.html (template (model));
      loader.render ();
      this.show_loader ();
      return this;
    }
  }

  return api;
});