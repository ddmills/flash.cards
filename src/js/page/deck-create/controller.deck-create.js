app.define.controller ('create_deck_controller', ['deck_model', 'create_deck_view'], function (deck_model, create_deck_view) {
  var api, model, view;

  api = {
    smoke: function(e) {
      console.log('blaze');
    },

    initialize: function () {
      model = deck_model ({ 'test': 'swagg!' });
      view = new create_deck_view (model);

      // view.when ('rendered', function (e) { console.log ('event triggered!'); }, this);
      view.render ();
      this.listen(view, 'rendered', this.smoke);
    }
  }

  return api;
});