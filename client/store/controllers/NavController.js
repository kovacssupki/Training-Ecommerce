(function(){
  'use strict'
    angular
      .module('app')
      .controller('NavController', NavController)

      NavController.$inject = ['$scope','$uibModal','authToken','$stateParams'];

      function NavController($scope, $uibModal, authToken, $stateParams){
        var vm = this;

        vm.imagePath = 'client/assets/img/logo.png';
        vm.isAuthenticated = authToken.isAuthenticated;
        // vm.user = user;
        // console.log('registered user in NavCtrl', vm.user);

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
            //  user: function () {
            //    return vm.user;
            //  }
           }

         });
           modalInstance.result.then(function(data){
            vm.user = data.user;
            console.log(data);
            console.log('vm.user in NavCtrl:', vm.user.email);
          })
        }//vm register

        vm.login = function () {
         var modalInstance = $uibModal.open({
           animation: true,
           ariaLabelledBy: 'modal-title',
           ariaDescribedBy: 'modal-body',
           templateUrl: '/../client/store/views/login.html',
           controller: 'LoginController',
           controllerAs: 'vm',
           size: 'medium',
           resolve: {
            //  items: function () {
            //    return $ctrl.items;
            //  }
           }
         });
       }//vm login



        vm.logout = function(){
          authToken.removeToken();
        }



      }//NavController


})();
