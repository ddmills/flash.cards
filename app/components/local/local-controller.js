app.controller('CtrlLocal', function($scope, $location, LocalDecks) {
  $scope.decks = LocalDecks.decks;
});
