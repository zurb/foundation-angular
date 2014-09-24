var app = angular.module('application', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlProvider) {

    $urlProvider.otherwise('/');

    angular.forEach(dynamicRoutes, function(page) {
      var state = {};
      state.url = page.url;
      state.templateUrl = page.path;
      state.parent = page.parent || '';
      state.controller = page.disableController ? '' : function($scope, $stateParams) {
        var params = [];
        angular.forEach($stateParams, function(value, key) {
          params[key] = value;
        });

        $scope.params = params;
        $scope.vars = page;
      }

      $stateProvider.state(page.name, state);
    });
}]);

