(function(App) {
  App.Models = {
    Card: Backbone.Model.extend({
      idAttribute: 'card_id',
      validate: function(attrs, options) {
        var errors = [];
        if (attrs.front.length == 0) {
          errors.push({ name: 'front', message: 'The card front cannot be blank.' });
        }
        if (attrs.back.length == 0) {
          errors.push({ name: 'back', message: 'The card back cannot be blank.' });
        }
        return errors.length > 0 ? errors : false;
      }
    }),

    Deck: Backbone.Model.extend({
      defaults: {
        public: '1',
        name: '',
        description: '',
        cards: {},
      },

      urlRoot: '/api/decks',

      initialize: function() {
        this.private_key = App.Local.hasDeck(this.id);
        this.set('cards', new App.Collections.Cards);
        this.get('cards').url = '/api/decks/' + this.id + '/cards?private_key=' + this.private_key;
        this.listenTo(this, 'sync', this.updateLocal);
      },

      validate: function(attrs, options) {
        var errors = [];
        if (!attrs.name || attrs.name.length == 0) {
          errors.push({ name: 'name', message: 'The deck must have a name.' });
        }
        return errors.length > 0 ? errors : false;
      },
    })
  }

  App.Collections = {
    Cards: Backbone.Collection.extend({
      model: App.Models.Card
    }),

    Decks: Backbone.Model.extend({
      model: App.Models.Deck
    })
  }
})(window.App);
