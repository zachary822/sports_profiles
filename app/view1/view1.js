'use strict';

angular.module('myApp.view1', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])

  .controller('View1Ctrl', ['$scope', '$http', function ($scope, $http) {
    $scope.getAge = function (dob) {
      return new Date().getFullYear() - new Date(dob).getFullYear();
    };

    $scope.capitalize = function (s) {
      return s[0].toUpperCase() + s.slice(1);
    };

    $scope.hasSocials = function (socials) {
      if (!socials) {
        return false;
      }
      return Object.keys(socials).length !== 0;
    };

    $http.get('/profiles')
      .then((resp) => {
        $scope.profiles = resp.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }]);
