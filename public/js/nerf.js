
var app = angular.module('nerf', ['ngRoute', 'ui.bootstrap'])

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){

  $locationProvider.html5Mode({enabled:true, requireBase : false})

  $routeProvider
    .when('/', {
      templateUrl: '/views/lookup.html',
      controller: 'Lookup'
    })
    .when('/lookup', {
      templateUrl: '/views/lookup.html',
      controller: 'Lookup'
    })
    .when('/nerfem', {
      templateUrl: '/views/nerfem.html',
      controller: 'Nerfem'
    })
    .when('/hidden-passive', {
      templateUrl: '/views/hidden.html',
      controller: 'HiddenPassive'
    })
}])

app.controller('NavbarCtrl', ['$scope', '$http', '$uibModal', '$rootScope', function($scope, $http, $uibModal, $rootScope){
  $rootScope.modalText = 'login'

  $scope.popModal = function (){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/views/modal.html',
      controller: 'ModalInstanceCtrl'
    })
  }

}])

app.controller('ModalInstanceCtrl', ['$scope', '$http', '$location', '$uibModalInstance', '$rootScope', function($scope, $http, $location, $uibModalInstance, $rootScope){
  $scope.header = 'login'
  $scope.regHeader = 'register'
  $scope.showLogin = false
  $scope.showRegister = false
  $scope.showControls = false
  $scope.failure = false
  $scope.favorites = []

  $http.get('/loggedin').success(function (favorites){
    if(favorites){
      $scope.favorites = favorites
      return changeView(3)
    }
    changeView(1)
  })

  $scope.login = function (){
    $http.post('/login', {
      username: $scope.username,
      password: $scope.password
    }).success(function (favorites){
      $scope.favorites = favorites
      changeView(3)
    }).error(function (){
      $scope.password = ''
      $scope.failure = 'Incorrect username or password'
    })
  }

  $scope.changeModal = function (){
    $scope.failure = false
    //register
    if($scope.showLogin){
      changeView(2)
    //login
    }else if ($scope.showRegister){
      changeView(1)
    //logout
    }else if ($scope.showControls){
      $http.get('/logout')
      changeView(1)
    }
  }

  $scope.register = function (){
    $http.post('/register', {
      username: $scope.regUser,
      password: $scope.regPass
    }).success(function (){
      $scope.favorites = []
      changeView(3)
    }).error(function (){
      $scope.regUser = ''
      $scope.regPass = ''
      $scope.failure = 'Username already exists'
    })
  }

  $scope.saveFav = function (){
    $http.post('/saveFav', {
      name: $scope.summoner
    }).success(function (summoner){
      $scope.favorites.push({ name: $scope.summoner })
      $scope.summoner = ''
    }).error(function (){
      $scope.failure = 'Save error'
    })
  }

  $scope.deleteFav = function (name){
    $http.post('/deleteFav', { name: name })
    for(var i = 0, len = $scope.favorites.length; i < len; ++i){
      if($scope.favorites[i].name === name){
        return $scope.favorites.splice(i, 1)
      }
    }
  }

  $scope.hidden = function (name){
    $location.path('/hidden-passive').search('s', name)
    $uibModalInstance.dismiss('cancel')
  }

  $scope.lookup = function (name){
    $location.path('/lookup').search('s', name)
    $uibModalInstance.dismiss('cancel')
  }

  var changeView = function (to){
    if(to === 1){
      $rootScope.modalText = 'login'
      $scope.showLogin = true
      $scope.showRegister = false
      $scope.showControls = false
      $scope.header = 'login'
      $scope.regHeader = 'register'
    }else if (to === 2){
      $rootScope.modalText = 'login'
      $scope.showLogin = false
      $scope.showRegister = true
      $scope.showControls = false
      $scope.header = 'register'
      $scope.regHeader = 'login'
    }else if (to === 3){
      $rootScope.modalText = 'account'
      $scope.showLogin = false
      $scope.showRegister = false
      $scope.showControls = true
      $scope.header = 'favorites'
      $scope.regHeader = 'logout'
    }
  }
}])

app.controller('Lookup', ['$scope', '$http', function($scope, $http){

  $http.post("/lookup/currentGame", {
   name: $scope.SummonerName
  }).success(function(game){
    console.log(game)
  })

}])

app.controller('Nerfem', ['$scope', '$http', '$filter', function($scope, $http, $filter){
  $scope.order_item = 'difference'
  $scope.order_reverse = true

  $http.get('/nerfem/champions').success(function (data){
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
    $http.post('/nerfem/upVote', { name: name })
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
    $http.post('/nerfem/downVote', { name: name })
  }

}])

app.controller('HiddenPassive', ['$scope', '$http', function($scope, $http){


    $scope.submitName = function() {
        var summ_name = $scope.summ_name
        console.log(summ_name)

    $http.post("/hidden/pastGames", {
     name: summ_name
    }).success(function(game){
        console.log(game)
        $scope.teammates = game.teammates
        $scope.opponents = game.opponents
        console.log("teammates")
        console.log($scope.teammates)
    })
    }

}])
