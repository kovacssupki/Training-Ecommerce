(function(){
  'use strict';
    angular
      .module('app')
      .controller('RegisterController', RegisterController)

      RegisterController.$inject = ['$scope','$uibModalInstance','$http'];

      function RegisterController($scope, $uibModalInstance, $http){
        var vm = this;
        vm.user = {};

        vm.submit = function(){

          $http.post('/user/register', vm.user, headers:{'Content-Type': 'application/json' }).success(function(response){
          console.log("User registered:", vm.user);
          $uibModalInstance.close(response);

          });

        }//register fn



        vm.cancel = function(){
          $uibModalInstance.close();
        }

      }//RegisterController
})();
