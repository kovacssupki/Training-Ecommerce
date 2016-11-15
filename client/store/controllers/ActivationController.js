(function(){
  'use strict';
    angular
      .module('app')
      .controller('ActivationController', ActivationController)


      ActivationController.$inject = ['$scope','$state','$stateParams','alert'];

      function ActivationController($scope, $state, $stateParams, alert){
        var vm = this;
        vm.logoPath = '/client/assets/img/logo.png';

        vm.code = $stateParams.code;
        vm.username = $stateParams.username;
        console.log($stateParams);
        
        vm.user = {};

        vm.confirm = function(){
           vm.result = angular.equals(vm.user.activationCode, vm.code);

          if(vm.result){
            alert('success','You are now registered, '+ vm.username +'!');
            $state.go('main');
          }
        }//confirm fn

      }//ActivationController



})();
