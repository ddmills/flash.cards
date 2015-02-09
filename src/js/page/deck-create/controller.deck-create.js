app.define.controller ('create_deck_controller', ['deck_model', 'create_deck_view'], function (deck_model, create_deck_view) {
  var api, model, view;

  api = {
    initialize: function () {
      model = deck_model ({ 'test': 'swagg!' });
      view = new create_deck_view (model);
      view.render ();
    }
  }

  return api;
});