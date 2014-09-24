var app = angular.module('application', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlProvider) {

    $urlProvider.otherwise('/');
    var complexViews = {};

    angular.forEach(dynamicRoutes, function(page) {
      //I am not proud of this code, I'll refactor when it works
      if (page.hasAbstract == true) {
        if (!angular.isDefined(complexViews[page.parent])) {
          complexViews[page.parent]['children'] = [];
        }
        complexViews[page.parent]['children'].push(page);
      } else if (page.abstract == true) {
        if(!angular.isDefined(complexViews[page.name])) {
          complexViews[page.name] = {};
          complexViews[page.name]['children'] = [];
        }

        angular.forEach(page, function(value, key) {
          complexViews[page.name][key] = value;
        });
      } else {
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
      }
    });

    angular.forEach(complexViews, function(page) {
        var state = {};
        state.url = page.url;
        state.parent = page.parent || '';
        state.controller = page.disableController ? '' : function($scope, $stateParams) {
          var params = [];
          angular.forEach($stateParams, function(value, key) {
            params[key] = value;
          });

          $scope.params = params;
          $scope.vars = page;
        }

        state.views = {};
        state.views[''] = {};
        state.views[''].templateUrl = page.path;

        angular.forEach(page.children, function(sub) {
          var title = sub.name + '@' + page.name;
          state.views[title] = {};
          state.views[title].templateUrl = sub.path;
        });

        $stateProvider.state(page.name, state);
    });
}]);

