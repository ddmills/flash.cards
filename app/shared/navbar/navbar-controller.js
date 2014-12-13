app.controller('CtrlNavbar', function($scope, $location, LocalDecks) {

  /* watch the local deck count */
  $scope.$watch(
    function() { return LocalDecks.count; },
    function(data) { $scope.decks = data; },
    true
  );

  /* check if given route is active */
  $scope.isActive = function(route) { return route === $location.path(); }

});
