
var app = angular.module('nerf', ['ngRoute', 'ui.bootstrap'])

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){

  $locationProvider.html5Mode({enabled:true, requireBase : false})

  $routeProvider
    .when('/', {
      templateUrl: '/views/home.html',
      controller: 'Lookup'
    })
    .when('/lookup', {
      templateUrl: '/views/home.html',
      controller: 'Lookup'
    })
    .when('/nerfem', {
      templateUrl: '/views/nerfem.html',
      controller: 'Nerfem'
    })
    .when('/hidden-passive', {
      templateUrl: '/views/home.html',
      controller: 'HiddenPassive'
    })
}])

app.controller('NavbarCtrl', ['$scope', '$http', function($scope, $http){

}])

app.controller('Lookup', ['$scope', '$http', function($scope, $http){

}])

app.controller('Nerfem', ['$scope', '$http', '$filter', function($scope, $http, $filter){
  $scope.order_item = 'difference'
  $scope.order_reverse = true

  $http.get('/data/champions').success(function (data){
    $scope.champions = data
  })

  $scope.upVote = function (name){
    var obj = $filter('filter')($scope.champions, { name: name }, true)[0]
    obj.upVotes++
    obj.totalVotes = obj.upVotes + obj.downVotes
    obj.difference = obj.upVotes - obj.downVotes
    if(obj.totalVotes){
      obj.upPercent = Math.round((obj.upVotes / obj.totalVotes) * 100)
      obj.downPercent = Math.round((obj.downVotes / obj.totalVotes) * 100)
    }
    $http.post('/data/upVote', { name: name })
  }

  $scope.downVote = function (name){
    var obj = $filter('filter')($scope.champions, { name: name }, true)[0]
    obj.downVotes++
    obj.totalVotes = obj.upVotes + obj.downVotes
    obj.difference = obj.upVotes - obj.downVotes
    if(obj.totalVotes){
      obj.upPercent = Math.round((obj.upVotes / obj.totalVotes) * 100)
      obj.downPercent = Math.round((obj.downVotes / obj.totalVotes) * 100)
    }
    $http.post('/data/downVote', { name: name })
  }

}])

app.controller('HiddenPassive', ['$scope', '$http', function($scope, $http){

}])
