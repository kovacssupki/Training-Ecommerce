(function(){
  'use strict'
    angular
      .module('app')
      .controller('NavController', NavController)

      NavController.$inject = ['$scope','$uibModal','authToken'];

      function NavController($scope, $uibModal, authToken){
        var vm = this;
        vm.msg = 'yoyo';
        vm.isAuthenticated = authToken.isAuthenticated;


        vm.register = function () {
         var modalInstance = $uibModal.open({
           animation: true,
           ariaLabelledBy: 'modal-title',
           ariaDescribedBy: 'modal-body',
           templateUrl: '/../client/store/views/register.html',
           controller: 'RegisterController',
           controllerAs: 'vm',
           size: 'medium',
           resolve: {
            //  items: function () {
            //    return $ctrl.items;
            //  }
           }
         });
        }//vm register

        vm.logout = function(){
          authToken.removeToken();
        }



      }//NavController


})();
