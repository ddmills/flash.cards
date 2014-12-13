app.service('LocalDecks', [function() {
  this.decks = localStorage.getItem('decks');
  this.count = 0;

  this._getCount = function() {
    var count = 0;
    for (var k in this.decks) { count++ }
    return count;
  }

  if (!this.decks) {
    this.decks = {};
    localStorage.setItem('decks', JSON.stringify(this.decks));
  } else {
    this.decks = JSON.parse(this.decks);
    this.count = this._getCount();
  }

  this.addDeck = function(deck_id, private_key) {
    this.decks[deck_id] = private_key;
    localStorage.setItem('decks', JSON.stringify(this.decks));
    this.count = this._getCount();
  }

  this.hasDeck = function(deck_id) {
    return this.decks[deck_id];
  }

  this.getMyIds = function() {
    var myIds = [];
    for (var k in this.decks) {
      myIds.push(k);
    }
    return myIds;
  }

  this.deleteDeck = function(deck_id) {
    delete this.decks[deck_id];
    this.count = this._getCount();
    localStorage.setItem('decks', JSON.stringify(this.decks));
  }

  this._cleanLocal = function() {
      this.decks = {};
      localStorage.setItem('decks', JSON.stringify(this.decks));
      this.count = 0;
      alert('local decks unset');
  }
}]);

app.service('DeckResource', ['$http', '$q', 'CardResource', 'LocalDecks', function($http, $q, CardResource, LocalDecks) {
  function DeckResource(data) {
    this.name = data.name;
    this.description = data.description;
    this.id = data.deck_id;
    this.cards = [];
  }
  // LocalDecks._cleanLocal();

  DeckResource.prototype.save = function() {
    var defer = $q.defer();
    var private_key = LocalDecks.hasDeck(this.id);
    if (private_key) {
      $http.put('api/decks/' + this.id + '?private_key=' + private_key, this.data())
        .success(function(response) {
          defer.resolve(response.data);
        })
        .error(function(response) {
          defer.reject(response);
        });
    } else {
      defer.reject('You do not own this deck');
    }
    return defer.promise;
  }

  DeckResource.prototype.data = function() {
      return {
        name: this.name,
        description: this.description
      }
  }

  DeckResource.prototype.addCard = function(cardData) {
    return CardResource.create(this, cardData);
  }

  DeckResource.prototype.delete = function() {
    var defer = $q.defer();
    var d = this;
    $http.delete('api/decks/' + this.id + '?private_key=' + this.owned())
      .success(function(response) {
        LocalDecks.deleteDeck(d.id);
        d = {};
        defer.resolve(response.data);
      })
      .error(function(data) {
        defer.reject(data);
      });
    return defer.promise;
  }

  DeckResource.prototype.fetchCards = function() {
    var defer = $q.defer();
    var d = this;
    $http.get('api/decks/' + this.id + '/cards')
      .success(function(response) {
        d.cards = [];
        for(var key in response.data) {
          d.cards.push(new CardResource(response.data[key]));
        }
        defer.resolve(d.cards);
      })
      .error(function(data) {
        defer.reject(data);
      });
    return defer.promise;
  }

  DeckResource.prototype.owned = function() {
    return LocalDecks.hasDeck(this.id);
  }

  DeckResource.create = function(deckData) {
    var defer = $q.defer();
    $http.post('api/decks/', deckData)
      .success(function(response) {
        LocalDecks.addDeck(response.data.deck_id, response.data.private_key);
        defer.resolve(new DeckResource(response.data));
      })
      .error(function(response) {
        defer.reject(response);
      });
    return defer.promise;
  }

  DeckResource.get = function(id) {
    var defer = $q.defer();
    $http.get('api/decks/' + id)
      .success(function(response) {
        defer.resolve(new DeckResource(response.data));
      })
      .error(function(data) {
        defer.reject(data);
      });
    return defer.promise;
  }

  return DeckResource;
}]);

app.service('CardResource', ['$http', '$q', function($http, $q) {
  function CardResource(data) {
    this.deckId = data.deck_id;
    this.id = data.card_id;
    this.front = data.front;
    this.back = data.back;
  }

  CardResource.prototype.save = function() {
    var defer = $q.defer();
    $http.put('api/decks/' + deck.id + '/cards/' + this.id + '?private_key=' + deck.owned(), cardData)
      .success(function(response) {
        defer.resolve(response.data);
      })
      .error(function(response) {
        defer.reject(response);
      });
    return defer.promise;
  }

  CardResource.create = function(deck, cardData) {
    var defer = $q.defer();
    $http.post('api/decks/' + deck.id + '/cards?private_key=' + deck.owned(), cardData)
      .success(function(response) {
        var card = new CardResource(response.data);
        deck.cards.unshift(card)
        defer.resolve(card);
      })
      .error(function(response) {
        defer.reject(response);
      });
    return defer.promise;
  }

  CardResource.get = function(deck, id) {
    var defer = $q.defer();
    $http.get('api/decks/' + deck.id + '/cards/' + id)
      .success(function(response) {
        defer.resolve(new CardResource(response.data));
      })
      .error(function(data) {
        defer.reject(data);
      });
    return defer.promise;
  }

  return CardResource;
}]);
