
var app = angular.module('application', ['ui.router', 'ngAnimate'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlProvider) {

    $urlProvider.otherwise('/');

    var complexViews = {};

    angular.forEach(dynamicRoutes, function(page) {
      if (page.hasComposed == true) {
        if (!angular.isDefined(complexViews[page.parent])) {
          complexViews[page.parent] = { children: [] };
        }

        complexViews[page.parent]['children'].push(page);
      } else if (page.composed == true) {
        if(!angular.isDefined(complexViews[page.name])) {
          complexViews[page.name] = { children: [] };
        }

        angular.extend(complexViews[page.name], page);
      } else {
        var state = {
          url: page.url,
          templateUrl: page.path,
          parent: page.parent || '',
          controller: page.controller || 'DefaultController',
          data: { vars: page },
        };

        $stateProvider.state(page.name, state);
      }
    });

    angular.forEach(complexViews, function(page) {
        var state = {
          url: page.url,
          parent: page.parent || '',
          controller: page.controller || 'DefaultController',
          resolve: { vars: function() { return page; } },
          views: { '': { templateUrl: page.path } }
        };

        angular.forEach(page.children, function(sub) {
          state.views[sub.name + '@' + page.name] = {
            templateUrl: sub.path,
            data: { vars: sub }
            };
        });

        $stateProvider.state(page.name, state);
    });
}]);

angular.module('application')
  .controller('DefaultController', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {
          var params = [];
          angular.forEach($stateParams, function(value, key) {
            params[key] = value;
          });

          $scope.params = params;
          $scope.vars = $state.current.data.vars;
        }
    ]);
