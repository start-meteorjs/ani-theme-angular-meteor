Fruits = new Mongo.Collection('fruits');

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

	angular.module('anitheme', ['angular-meteor', 'ui.router', 'ngAnimate', 'accounts.ui']);
 
  angular.module('anitheme').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/overview');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    	.state('base', {
        abstract: true,
        url: '',
        templateUrl: 'views/base.html'
      })
        .state('login', {
          url: '/login',
          templateUrl: 'client/views/login.ng.html',
          controller: 'LoginCtrl'
        })
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'client/views/dashboard.ng.html',
          controller: 'DashboardCtrl'
        })
          .state('overview', {
            url: '/overview',
            parent: 'dashboard',
            templateUrl: 'client/views/dashboard/overview.ng.html'
          })
          .state('reports', {
            url: '/reports',
            parent: 'dashboard',
            templateUrl: 'client/views/dashboard/reports.ng.html'
          })
          .state('datapage', {
            url: '/datapage',
            parent: 'dashboard',
            templateUrl: 'client/views/dashboard/datapage.ng.html',
            controller: 'DatapageCtrl'
          });

  });

  angular.module('anitheme').run(function($state){});

  angular.module('anitheme').controller('BaseCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {
    }
  ]);

  angular.module('anitheme').controller('DashboardCtrl', function($scope, $state) {

    $scope.$state = $state;
  });

  angular.module('anitheme').controller('LoginCtrl', function($scope, $location) {
  
      $scope.submit = function() {

        $location.path('/dashboard');

        return false;
      }

  });

  angular.module('anitheme').controller('DatapageCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {
 
      $scope.fruits = $meteor.collection(function(){
        return Fruits.find($scope.getReactively('query'))
      });

      $scope.$watch('citrus', function() {
        if ($scope.citrus)
          $scope.query = {citrus: {$ne: false}};
        else
          $scope.query = {};
      });
      
      $scope.addFruit = function (newFruit) {
        Fruits.insert({
          text: newFruit,
          citrus: false,
          username: Meteor.user().username
        });
    
      }
      
    }]);
}