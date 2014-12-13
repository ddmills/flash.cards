app.controller('CtrlCreate', function($scope, $location, $http, LocalDecks, DeckResource) {

    $scope.deckName = '';
    $scope.deckDescription = '';

    $scope.process_form = function() {
        var deckData = {
          name: $scope.deckName,
          description: $scope.deckDescription
        }
        DeckResource.create(deckData).then(function(deck) {
          console.log(deck);
          $location.path('edit/' + deck.id);
        });
    }
});
