(function(App) {
  App.Local = {
    decks: {},
    count: 0,
    initialize: function() {
      this.decks = localStorage.getItem('decks');
      if (!this.decks) {
        this.decks = {};
        localStorage.setItem('decks', JSON.stringify(this.decks));
      } else {
        this.decks = JSON.parse(this.decks);
      }
      this._getCount();
    },

    _getCount: function() {
      var count = 0;
      for (var k in this.decks) { count++ }
      return count;
    },

    addDeck: function(deck_id, private_key) {
      this.decks[deck_id] = private_key;
      localStorage.setItem('decks', JSON.stringify(this.decks));
      this.count = this._getCount();
    },

    hasDeck: function(deck_id) {
      return this.decks[deck_id];
    },

    getMyIds: function() {
      var myIds = [];
      for (var k in this.decks) {
        myIds.push(k);
      }
      return myIds;
    },

    deleteDeck: function(deck_id) {
      delete this.decks[deck_id];
      this.count = this._getCount();
      localStorage.setItem('decks', JSON.stringify(this.decks));
    },

    _cleanLocal: function() {
      var r = confirm('do you want to reset all local decks?');
      if (r) {
        this.decks = {};
        localStorage.setItem('decks', JSON.stringify(this.decks));
        this.count = 0;
        alert('local decks unset');
      }
    }
  }
  App.Local.initialize();
})(window.App);
