(function(){
  'use strict'

  angular
    .module('app')
    .controller('detailsController', detailsController)

detailsController.$inject = ['$uibModalInstance','$http','$timeout','product'];

    function detailsController($uibModalInstance, $http, $timeout, product){

      var vm = this;

      console.log('hello from details controller');

      vm.product = product;
      console.log(vm.product);

       vm.ok = function () {
          $uibModalInstance.close(true);
       };


    }//ModalInstanceCtrlend


})();
