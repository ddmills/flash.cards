(function(App) {
  App.Models = {

    Card: Backbone.Model.extend({
      idAttribute: 'card_id',
      defaults: {
        deck_id: 0
      },
      initialize: function() {
        this.urlBase = '/api/decks/' + this.get('deck_id') + '/cards',
        this.private_key = 0;
      },
      validate: function(attrs, options) {
        var errors = [];
        if (attrs.front.length == 0) {
          errors.push({ name: 'front', message: 'The card front cannot be blank.' });
        }
        if (attrs.back.length == 0) {
          errors.push({ name: 'back', message: 'The card back cannot be blank.' });
        }
        return errors.length > 0 ? errors : false;
      },
      methodUrl:  function(method) {
        if (method == 'delete' || method == 'update') {
          if (App.User.isLoggedIn()) {
            return this.urlBase + '/' + this.id;
          }
          return this.urlBase + '/' + this.id + '?private_key=' + this.private_key;
        } else if (method == 'create') {
          if (App.User.isLoggedIn()) {
            return this.urlBase;
          }
          return this.urlBase + '?private_key=' + this.private_key;
        } else if (method == 'read') {
          return this.urlBase + '/' + this.id;
        }
        return false;
      }
    }),

    Deck: Backbone.Model.extend({
      defaults: {
        public      : '1',
        name        : '',
        description : '',
        cards       : {},
      },
      idAttribute: 'deck_id',
      urlRoot: '/api/decks',
      // urlBase: '/api/decks',
      initialize: function() {
        if (!this.isNew()) {
          var key = App.Local.hasDeck(this.id);
          this.owned = false;
          this.private_key = false;
          if (key) {
            this.owned = true;
            this.private_key = key;
          }
          var deckInfo = {
            owned       : this.owned,
            private_key : this.private_key,
            id          : this.id
          };
          this.set('cards', (new App.Collections.Cards([], this)));
        }
      },
      methodUrl:  function(method) {
        if (method == 'delete' || method == 'update') {
          return this.urlRoot + '/' + this.id + '?private_key=' + this.private_key;
        } else if (method == 'create') {
          return this.urlRoot;
        } else if (method == 'read') {
          return this.urlRoot + '/' + this.id;
        }
        return false;
      },
      validate: function(attrs, options) {
        var errors = [];
        if (!attrs.name || attrs.name.length == 0) {
          errors.push({ name: 'name', message: 'The deck must have a name.' });
        }
        return errors.length > 0 ? errors : false;
      },
    })
  };

  App.Collections = {
    Cards: Backbone.Collection.extend({
      model: App.Models.Card,
      initialize: function(models, deck) {
        this.deck    = deck;
        this.urlBase = '/api/decks/' + this.deck.id + '/cards';
        this.url     = this.urlBase;// + '?private_key=' + this.private_key;
      }
    }),

    Decks: Backbone.Model.extend({
      model: App.Models.Deck
    }),

    BrowseDecks: Backbone.Collection.extend({
      model: App.Models.Deck,
      url: 'api/decks/browse/recent/',
      initialize: function() {
      }
    })
  };
})(window.App);
