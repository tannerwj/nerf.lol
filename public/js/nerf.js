
var app = angular.module('nerf', ['ngRoute', 'ui.bootstrap'])

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){

  //$locationProvider.html5Mode({enabled:true, requireBase : false})

  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'Lookup'
    })
    .when('/lookup', {
      templateUrl: 'views/home.html',
      controller: 'Lookup'
    })
    .when('/nerfem', {
      templateUrl: 'views/home.html',
      controller: 'Nerfem'
    })
    .when('/shaco-curse', {
      templateUrl: 'views/home.html',
      controller: 'ShacoCurse'
    })


}])

app.controller('NavbarCtrl', ['$scope', '$http', function($scope, $http){

}])

app.controller('Lookup', ['$scope', '$http', function($scope, $http){

}])

app.controller('Nerfem', ['$scope', '$http', function($scope, $http){

}])

app.controller('ShacoCurse', ['$scope', '$http', function($scope, $http){

}])
