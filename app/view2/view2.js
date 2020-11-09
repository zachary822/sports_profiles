'use strict';

function formAssign(a, ...b) {
  for (let f of b) {
    for (let k of new Set(f.keys())) {
      let [vh, ...vs] = f.getAll(k);
      a.set(k, vh);
      if (vs.length) {
        for (let v of vs) {
          a.append(k, v);
        }
      }
    }
  }

  return a;
}

angular.module('myApp.view2', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view2', {
      templateUrl: 'view2/view2.html',
      controller: 'View2Ctrl'
    });
  }])

  .controller('View2Ctrl', ['$scope', function ($scope) {
    $scope.totalData = new FormData();

    function submit(form) {
      $scope.totalData = formAssign(new FormData(), $scope.totalData, new FormData(form));
    }

    $scope.today = function () {
      return new Date().toISOString().substring(0, 10);
    };

    $scope.handleImage = function (e) {
      let file = e.target.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = function () {
          console.log();
          $scope.totalData.set('profileImage', 'data:' + file.type + ';base64,' + encodeURIComponent(btoa(this.result)));
        };
        reader.readAsBinaryString(file);
      }
    };

    $scope.tabClick = function (e) {
      let form = document.querySelector('div#myTabContent div.active form');
      submit(form);
      for (let f of form) {
        if (!f.checkValidity()) {
          // e.stopPropagation();
          // form.querySelector('button').click();  // force form validation popup
          break;
        }
      }
    };

    $scope.click0 = function (e) {
      $('#myTab a[data-target="#basic"]').tab('show');
    }

    $scope.click1 = function (e) {
      if (e) {
        submit(e.target);
      }
      $('#myTab a[data-target="#about"]').tab('show');
    };
    $scope.click2 = function (e) {
      if (e) {
        submit(e.target);
      }
      $('#myTab a[data-target="#social"]').tab('show');
    };
    $scope.click3 = function (e) {
      if (e) {
        submit(e.target);
      }
      $('#myTab a[data-target="#summary"]').tab('show');
    };
    $scope.click4 = function (e) {
      if (e) {
        submit(e.target);
      }
      if ($scope.currentId) {
        console.log('update!');
        fetch('/profiles/' + $scope.currentId, {
          method: 'PUT',
          body: $scope.totalData
        })
          .then(function (resp) {
            if (!resp.ok) {
              throw resp;
            }
            return resp.json();
          })
          .then(function (data) {
            $scope.currentId = data._id;
            $scope.saveMessage = "Saved";
          })
          .catch((err) => {
            console.error(err);
            $scope.saveMessage = "Error";
          });
      } else {
        fetch('/profiles', {
          method: 'POST',
          body: $scope.totalData
        })
          .then(function (resp) {
            if (!resp.ok) {
              throw resp;
            }
            return resp.json();
          })
          .then(function (data) {
            $scope.currentId = data._id;
            $scope.saveMessage = "Saved";
          })
          .catch((err) => {
            console.error(err);
            $scope.saveMessage = "Error";
          })
          .finally(() => {
            $scope.$digest();
          });
      }
    };
  }])
  .directive("ngUploadChange", function () {
    return {
      scope: {
        ngUploadChange: "&"
      },
      link: function ($scope, $element, $attrs) {
        $element.on("change", function (event) {
          $scope.$apply(function () {
            $scope.ngUploadChange({$event: event});
          });
        });
        $scope.$on("$destroy", function () {
          $element.off();
        });
      }
    };
  });
