app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/create', {
                templateUrl : 'app/components/create/create-partial.html',
                controller  : 'CtrlCreate'
            })
            .when('/local', {
                templateUrl : 'app/components/local/local-partial.html',
                controller  : 'CtrlLocal'
            })
            .when('/browse', {
                templateUrl : 'app/components/browse/browse-partial.html',
                controller  : 'CtrlBrowse'
            })
            .when('/edit/:deck_id', {
                templateUrl : 'app/components/edit/edit-partial.html',
                controller  : 'CtrlEdit',
            })
            .otherwise({
                redirectTo  : '/',
                templateUrl : 'app/components/landing/landing-partial.html',
                controller  : 'CtrlLanding',
            });
        $locationProvider.html5Mode(true);
    }
]);