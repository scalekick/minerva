var app = angular.module('minerva', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('guest', {
      url: '/guest',
      templateUrl: '/assets/guest.html',
      controller: 'MainCtrl'
    })
    .state('pricing', {
      url: '/pricing',
      templateUrl: '/assets/pricing.html',
      controller: 'MainCtrl'
    })
    .state('terms', {
      url: '/terms',
      templateUrl: '/assets/terms.html',
      controller: 'MainCtrl'
    })
    .state('thankyou', {
      url: '/thankyou',
      templateUrl: '/assets/thankyou.html',
      controller: 'MainCtrl'
    })
    .state('contact', {
      url: '/contact',
      templateUrl: '/assets/contact.html',
      controller: 'MainCtrl'
    });

  $urlRouterProvider.otherwise('guest');
}]);

app.controller('MainCtrl', [
  '$scope', '$http',
  function($scope, $http){
    $scope.contact = {};

    $scope.sendMail = function(){
      //console.log('trigger');
      $http.post('/contact', $scope.contact).success(function(data){
        //console.log('sent');
      });
    };
  }
]);
