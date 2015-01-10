(function(App) {
  /*******************************************
   *  CREATE DECK VIEW                       *
   *******************************************/
  App.Views.Create = Backbone.View.extend({
    initialize: function() {
      this.model = new App.Models.Deck;
      this.binder = new Backbone.ModelBinder;
      this.template = _.template($('#view-create-template').html());
    },

    events: {
      'click #submit-create-deck': 'submit'
    },

    render: function() {
      this.$el.html(this.template());
      this.binder.bind(this.model, this.el);
      return this;
    },

    submit: function() {
      if (this.model.isValid()) {
        this.model.save(null, { success: function(data) {
          var public_key = data.get('deck_id');
          var private_key = data.get('private_key');
          App.Local.addDeck(public_key, private_key);
          data.unset('private_key');
          App.Router.navigate('edit/' + public_key, { trigger: true });
        }});
      } else {
        _.each(this.model.validationError, function(error) {
          this.$('#help-deck-'+ error.name).html(error.message);
        });
      }
    },

    onClose: function() {
      this.binder.unbind();
    }
  });
})(window.App);
