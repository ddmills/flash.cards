app.controller('CtrlEdit', function($rootScope, LocalDecks, $modal, $scope, $http, DeckResource, $routeParams, $route) {
  $scope.busyCount = 0;
  $scope.busy = function(a) {
    if (a) {
      $scope.busyCount++;
    } else {
      $scope.busyCount--;
    }
    if ($scope.busyCount < 0) {
      $scope.busyCount = 0;
    }
  }

  $scope.isBusy = function() {
    return $scope.busyCount > 0;
  }


  $scope.title = 'Loading Deck';
  $scope.busy(true);
  $scope.loadSuccess = false;
  $scope.message = false;
  $scope.newCard = { front: '', back: '' };
  $scope.empty = false;

  if (LocalDecks.hasDeck($routeParams.deck_id)) {
    DeckResource.get($routeParams.deck_id).then(function(data) {
      $scope.deck = data;
      $scope.title = $scope.deck.name;
      $scope.loadSuccess = true;
      $scope.deck.name = 'yolo swag';
      $scope.busy(false);

      var cardData = {
        front: 'card front...',
        back: 'card back!'
      }

      $scope.busy(true);
      $scope.deck.fetchCards().then(function(data) {
        $scope.busy(false);
      });
      // $scope.deck.delete().then(function(data) { console.log(data); });
      // $scope.deck.addCard(cardData).then(function(data) { console.log(data); });
      // $scope.deck.save().then(function(data) { console.log(data); });
    }, function(response) {
      $scope.message = {
        type: 'danger',
        msg: 'There was an error retrieving this deck from the server. (' + response.code + ': ' + response.data + ')'
      }
      console.log(response);
    });
  } else {
    $scope.message = {
      type: 'danger',
      msg: 'You cannot edit this deck. Decks can only be edited from the same computer and browser that they were created from if you\'re not logged in.'
    }
  }

  $scope.addCard = function() {
    document.getElementById('newCardFront').focus();
    $scope.deck.addCard($scope.newCard).then(function(data) { console.log(data); });
    $scope.newCard = { front: '', back: '' };
  }

  $scope.deleteDeck = function() {
    var inst = $modal.open({
      templateUrl: 'deleteDeck.html',
      size: 'sm'
    });
    inst.result.then(function(del) {
      if (del) {
        $scope.confirmDelete();
      }
    });
    // inst.result.then(function(delete) {
    //   if (delete) {
    //     console.log('yiss');
    //   } else {
    //     console.log('nooo');
    //   }
    // });
  }

  $scope.confirmDelete = function() {
    $scope.deck.delete().then(function(data) {
      $scope.deck = {};
      $scope.title = 'Deleted';
      $scope.message = {
        type: 'success',
        msg: 'Deck deleted successfully.'
      }
    });
  }
});
