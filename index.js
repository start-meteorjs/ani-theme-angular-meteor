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
          controller: 'DashboardCtrl',
          resolve: {
            "currentUser": ["$meteor", function($meteor){
              return $meteor.requireUser();
            }]
          }
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

  angular.module('anitheme').run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      if (error === "AUTH_REQUIRED") {
        $state.go('login');
      }
    });
  }]);

  angular.module('anitheme').controller('BaseCtrl', ['$scope', '$meteor', '$location',
    function ($scope, $meteor) {
    }
  ]);

  angular.module('anitheme').controller('DashboardCtrl', function($scope, $state, $location) {
    $scope.$state = $state;

    $scope.logout = function(){
      Meteor.logout();
    }
  });

  angular.module('anitheme').controller('LoginCtrl', function($scope, $location) {
      $scope.loginFailed = false;

      $scope.submit = function(email, passwd) {
        if(email==null || typeof(email)=='undefined' || email=='')
          alert('Please enter email');
        else if(passwd==null || typeof(passwd)=='undefined' || passwd=='')
          alert('Please enter password');
        else{
          Meteor.loginWithPassword(email, passwd);

          Accounts.onLoginFailure(function(){
            $scope.loginFailed = true;
          });

          Accounts.onLogin(function(){
            $scope.loginFailed = false;
            $location.path('/dashboard');
          });

        }
        return false;
      }

      $scope.createuser = function(email, passwd){
        Accounts.createUser({
            email: email,
            password: passwd
        });
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