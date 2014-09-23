var app = angular.module('application', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlProvider) {

  $urlProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html'
    })
    .state('page', {
      url: '/page',
      templateUrl: 'templates/page.html'
    })
}])
