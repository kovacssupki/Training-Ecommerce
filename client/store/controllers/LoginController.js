(function(){
  'use strict';
    angular
      .module('app')
      .controller('LoginController', LoginController)


      LoginController.$inject = ['$scope','$uibModalInstance','$http', 'authToken','alert'];

      function LoginController($scope, $uibModalInstance, $http, authToken, alert){
        var vm = this;
        vm.user = {};


        vm.submit = function(){

          

        }//register fn



        vm.cancel = function(){
          $uibModalInstance.close();
        }

      }//RegisterController



})();
