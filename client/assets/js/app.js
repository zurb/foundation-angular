var app = angular.module('application', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlProvider) {

  $urlProvider.otherwise('/');

    angular.forEach(dynamicRoutes, function(page) {
      var state = {};
      state.url = page.url;
      state.templateUrl = page.path;
      state.parent = page.parent ? page.parent : '';
      $stateProvider.state(page.name, state);
    });
}]);

