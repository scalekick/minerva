var app = angular.module('minerva', ['ui.router','chart.js']);

app.factory('prices', ['$http', function($http){
  var o = {
    prices: []
  };
  o.getAll = function() {
    return $http.get('/api/pricing/spirit/2016').success(function(data){
      angular.copy(data, o.prices);
    });
  };
  o.get = function(id) {
    return $http.get('/api/pricing/spirit/2016/' + id).success(function(data){
      angular.copy(data, o.prices);
    });
};
  return o;
}])
.factory('locations', ['$http', function($http){
  var o = {
    locations: []
  };
  o.getAll = function() {
    return $http.get('/api/sales/spirit/2016/1/2016/12').success(function(data){
      angular.copy(data, o.locations);
    });
  };
  o.get = function(id) {
    return $http.get('/api/location/spirit/2016/' + id).success(function(data){
      angular.copy(data, o.locations);
    });
};
  return o;
}])
.factory('auth', ['$http', '$window', '$rootScope', function($http, $window, $rootScope){
   var auth = {
    saveToken: function (token){
      $window.localStorage['minerva-token'] = token;
    },
    getToken: function (){
      return $window.localStorage['minerva-token'];
    },
    isLoggedIn: function(){
      var token = auth.getToken();
      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    },
    currentUser: function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.username;
      }
    },
    register: function(user){
      return $http.post('/pay', user).success(function(data){
        console.log('cool111');
        $window.location.href = '/#/thankyou';
        //auth.saveToken(data.token);
      });
    },
    logIn: function(user){
      return $http.post('/login', user).success(function(data){
        auth.saveToken(data.token);
      });
    },
    logOut: function(){
      $window.localStorage.removeItem('minerva-token');
    }
  };

  return auth;
}]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/assets/home.html',
      controller: 'MainCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(!auth.isLoggedIn()){
          $state.go('login');
        }
      }],
      resolve: {
        locationsPromise: ['$stateParams', 'locations', function($stateParams, locations) {
          return locations.getAll();
        }]
      }
    })
    .state('prices', {
      url: '/prices/{id}',
      templateUrl: '/assets/prices.html',
      controller: 'PriceCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(!auth.isLoggedIn()){
          $state.go('login');
        }
      }],
      resolve: {
        pricesPromise: ['$stateParams', 'prices', function($stateParams, prices) {
          return prices.get($stateParams.id);
        }]
      }
    })
    .state('locations', {
      url: '/locations/{id}',
      templateUrl: '/assets/locations.html',
      controller: 'LocationCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(!auth.isLoggedIn()){
          $state.go('login');
        }
      }],
      resolve: {
        locationsPromise: ['$stateParams', 'locations', function($stateParams, locations) {
          return locations.get($stateParams.id);
        }]
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/assets/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('register', {
      url: '/register/{plan}',
      templateUrl: '/assets/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('pay', {
      url: '/pay',
      templateUrl: '/assets/pay.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        //console.log('get');
        //auth.pay();
        //$state.go('login');
      }]
    })
    .state('logout', {
      url: '/logout',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        auth.logOut();
        $state.go('login');
      }]
    });
  $urlRouterProvider.otherwise('home');
}]);

app.controller('PriceCtrl', [
'$scope', '$window', 'prices',
function($scope, $window, prices){
  var objDate = new Date(prices.prices[1].month + '/1/' + prices.prices[1].year);
  $scope.month = objDate.toLocaleString("en-us", { month: "long" });
  $scope.category = prices.prices[1].category.charAt(0).toUpperCase() + prices.prices[1].category.slice(1); ;
  $scope.year = prices.prices[1].year;
  $scope.choseMonth = prices.prices[1].month;

  var salesData = [];
  var ordersData = [];
  var rangeData = [];
  var salesTotal = 0, ordersTotal = 0, productsTotal = 0;

  for (i=0; i<prices.prices.length; i++) {
    salesData.push(prices.prices[i].sales);
    ordersData.push(prices.prices[i].orders);
    rangeData.push('¥' + prices.prices[i].range_start + '-' + prices.prices[i].range_end);
    salesTotal += prices.prices[i].sales;
    ordersTotal += prices.prices[i].orders;
    productsTotal += prices.prices[i].products;
  }

  $scope.chartDataSales = [salesData];
  $scope.labels = rangeData;
  $scope.series = ['Sales'];
  $scope.colors = [{
    backgroundColor:"#6aa4f8",
    borderColor:"#4e75b5",
    hoverBackgroundColor:"#3a63a7",
    hoverBorderColor:"#4e75b5"
  }];
  $scope.chartDataOrders = [ordersData];
  $scope.seriesAlt = ['Orders'];
  $scope.colorsAlt = [{
    backgroundColor:"#5ce3b6",
    borderColor:"#4fb593",
    hoverBackgroundColor:"#339977",
    hoverBorderColor:"#339977"
  }];
  $scope.options = {
    responsive: true,
    maintainAspectRatio: false
  }

  $scope.prices = prices.prices;
  $scope.salesTotal = salesTotal;
  $scope.ordersTotal = ordersTotal;
  $scope.productsTotal = productsTotal;

  $scope.monthsOption = monthsRef;
  $scope.choseMonth = $scope.monthsOption[$scope.choseMonth-1];

  $scope.updatePage = function() {
    $window.location.href = '#/prices/' + $scope.choseMonth.code;
  }

}])
.controller('LocationCtrl', [
'$scope', '$window', 'locations',
function($scope, $window, locations){
  var objDate = new Date(locations.locations[1].month + '/1/' + locations.locations[1].year);
  $scope.month = objDate.toLocaleString("en-us", { month: "long" });
  $scope.category = locations.locations[1].category.charAt(0).toUpperCase() + locations.locations[1].category.slice(1); ;
  $scope.year = locations.locations[1].year;
  $scope.choseMonth = locations.locations[1].month;

  var salesData = [];
  var ordersData = [];
  var locationData = [];
  var salesTotal = 0, ordersTotal = 0, productsTotal = 0;

  for (i=0; i<locations.locations.length; i++) {
    salesData.push(locations.locations[i].sales);
    ordersData.push(locations.locations[i].orders);
    locationData.push(locations.locations[i].location);
    salesTotal += locations.locations[i].sales;
    ordersTotal += locations.locations[i].orders;
    productsTotal += locations.locations[i].products;
  }

  $scope.chartDataSales = [salesData];
  $scope.labels = locationData;
  $scope.series = ['Sales'];
  $scope.colors = [{
    backgroundColor:"#6aa4f8",
    borderColor:"#4e75b5",
    hoverBackgroundColor:"#3a63a7",
    hoverBorderColor:"#4e75b5"
  }];
  $scope.chartDataOrders = [ordersData];
  $scope.seriesAlt = ['Orders'];
  $scope.colorsAlt = [{
    backgroundColor:"#5ce3b6",
    borderColor:"#4fb593",
    hoverBackgroundColor:"#339977",
    hoverBorderColor:"#339977"
  }];
  $scope.options = {
    responsive: true,
    maintainAspectRatio: false
  }

  $scope.locations = locations.locations;
  $scope.salesTotal = salesTotal;
  $scope.ordersTotal = ordersTotal;
  $scope.productsTotal = productsTotal;

  $scope.monthsOption = monthsRef;
  $scope.choseMonth = $scope.monthsOption[$scope.choseMonth-1];

  $scope.updatePage = function() {
    $window.location.href = '#/locations/' + $scope.choseMonth.code;
  }

}])
.controller('MainCtrl', [
'$scope', '$window', 'locations',
function($scope, $window, locations){

  var salesData = [];
  var labelData = [];
  var salesTotal = 0, ordersTotal = 0, productsTotal = 0;

  //console.log(locations.locations);

  for (i=0; i<locations.locations.length; i++) {
    salesData.push(locations.locations[i].sales);
    labelData.push(locations.locations[i].year + ' ' + locations.locations[i].month);
    salesTotal += locations.locations[i].sales;
    ordersTotal += locations.locations[i].orders;
    productsTotal += locations.locations[i].products;
  }

  $scope.chartDataSales = [salesData];
  $scope.labels = labelData;
  $scope.series = ['Sales'];
  $scope.colors = [{
    backgroundColor:"#6aa4f8",
    borderColor:"#4e75b5",
    hoverBackgroundColor:"#3a63a7",
    hoverBorderColor:"#4e75b5"
  }];
  $scope.options = {
    responsive: true,
    maintainAspectRatio: false
  }
  $scope.collection = locations.locations;
  $scope.salesTotal = salesTotal;
  $scope.ordersTotal = ordersTotal;
  $scope.productsTotal = productsTotal;
  $scope.months = monthsRef;

}])
.controller('AuthCtrl', [
'$scope',
'$state',
'$stateParams',
'auth',
function($scope, $state, $stateParams, auth){
  $scope.user = {};
  $scope.plans = {
    options: [
      {id: 'minerva-single', name: 'Basic Plan - $200 / month'},
      {id: 'minerva-complete', name: 'Platinum Plan - $500 / month'}
    ]
  };

  if ($stateParams.plan) {
    var plan = $stateParams.plan;
    switch (plan)
    {
      case 'basic':
        $scope.user.plan = $scope.plans.options[0];
        break;
      default:
        $scope.user.plan = $scope.plans.options[1];
        break;
    }
  }

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logout = function(){
    auth.logout().error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('login');
    });
  };

  $scope.pay = function(){
    auth.pay().error(function(error){
      console.log(error);
      $scope.error = error;
    }).then(function(){
      //$state.go('home');
    });
  };
}])

.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);

const monthsRef = [ {code: 1, name: 'Jan'}, {code: 2, name: 'Feb'}, {code: 3, name: 'Mar'}, {code: 4, name: 'Apr'}, {code: 5, name: 'May'}, {code: 6, name: 'Jun'},
                    {code: 7, name: 'Jul'}, {code: 8, name: 'Jul'}, {code: 9, name: 'Sep'}, {code: 10, name: 'Oct'}, {code: 11, name: 'Nov'}, {code: 12, name: 'Dec'}];
