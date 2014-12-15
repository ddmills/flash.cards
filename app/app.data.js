(function(App) {
  App.Models = {

    Card: Backbone.Model.extend({
      idAttribute: 'card_id',
      initialize: function() {
        if (!this.isNew()) {
          this.url = this.collection.urlBase + '/' + this.id + '?private_key=' + this.collection.deck.private_key;
          console.log(this.url);
        }
        // this.url = '/api/decks' + + '/cards/' + this.id + '?private_key=';
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
      initialize: function() {
        if (!this.isNew()) {
          var key = App.Local.hasDeck(this.id);
          this.owned = false;
          if (key) {
            this.owned = true;
            this.private_key = key;
            this.set('cards', new App.Collections.Cards(this));
          }
        }
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
      model: App.Models.Card,
      initialize: function(deck) {
        this.deck = deck;
        this.urlBase = this.deck.urlRoot + '/' + this.deck.id + '/cards';
        this.url = this.urlBase + '?private_key=' + this.deck.private_key;
      }
    }),

    Decks: Backbone.Model.extend({
      model: App.Models.Deck
    }),

    BrowseDecks: Backbone.Collection.extend({
      model: App.Models.Deck,
      initialize: function() {
        this.url = 'api/decks/browse/recent/';
      }
    })
  }
})(window.App);
