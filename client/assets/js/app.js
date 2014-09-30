window.jQuery = window.$ = function(el) {
  if(typeof el == "string" && el.charAt(0) != '<') {
    el = document.querySelectorAll(el);
  }
  return angular.element(el);
}

var app = angular.module('application', ['ui.router', 'ngAnimate'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlProvider) {

    $urlProvider.otherwise('/');

    var complexViews = {};

    angular.forEach(dynamicRoutes, function(page) {
      if (page.hasComposed == true) {
        if (!angular.isDefined(complexViews[page.parent])) {
          complexViews[page.parent] = { children: {} };
        }

        complexViews[page.parent]['children'][page.name] = page;
      } else if (page.composed == true) {
        if(!angular.isDefined(complexViews[page.name])) {
          complexViews[page.name] = { children: {} };
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
          data: { vars: page },
          views: { '': {
              templateUrl: page.path,
              controller: page.controller || 'DefaultController',
            }
          }
        };

        angular.forEach(page.children, function(sub) {
          state.views[sub.name + '@' + page.name] = {
            templateUrl: sub.path,
            controller: page.controller || 'DefaultController',
            };
        });

        $stateProvider.state(page.name, state);
    });
}]);

angular.module('application')
  .animation('.ui-animation', ['$state', 'Utils', function($state, u) {
    return {
      enter: function(element, done) {
        var scope = element.scope();
        if(scope.vars.animationIn) {
          animation = scope.vars.animationIn;
          element.addClass(animation + ' animated');
          element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            element.removeClass(animation);
            element.removeClass('animated');
            done();
          });
          done();
        } else {
          done();
        }

        return function(isCancelled) {

        }
      },
      leave: function(element, done) {
        var scope = element.scope();
        var animation = '';
        if(scope.vars && scope.vars.animationOut) {
          animation = scope.vars.animationOut;
          element.addClass(animation + ' animated');
          element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            element.removeClass(animation);
            element.removeClass('animated');
            done();
          });
        } else {
          done();
        }

          return function(isCancelled) {

          }
       }
    }


  }]);
