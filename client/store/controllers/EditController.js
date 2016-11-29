(function(){
  'use strict';
    angular
      .module('app')
      .controller('EditController', EditController)


      EditController.$inject = ['$scope','$state','$stateParams','alert','$http','authToken','$uibModalInstance','product'];

      function EditController($scope, $state, $stateParams, alert, $http, authToken, $uibModalInstance, product){
        var vm = this;

        vm.product = product;

        vm.editProd = function(){
          // console.log('editing product: ', vm.product);
          $http.put('/product/'+ vm.product._id +'/edit', vm.product).success(function(response){
            console.log('succesfully edited !');
          })
          $uibModalInstance.close(vm.product);
        }


    }//EditController



})();
