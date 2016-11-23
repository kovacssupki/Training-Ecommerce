(function(){
  'use strict';
    angular
      .module('app')
      .controller('OrdersController', OrdersController)


      OrdersController.$inject = ['$scope','$state','$stateParams','alert','$http','authToken','orders'];

      function OrdersController($scope, $state, $stateParams, alert, $http, authToken, orders){
        var vm = this;
        vm.logoPath = '/client/assets/img/logo.png';
        vm.isAuthenticated = authToken.isAuthenticated;
        vm.userid = $stateParams.userid;

        vm.orders = orders;
        console.log('vm.orders.orders', vm.orders.orders);

        vm.empty = function(){
          if (!vm.orders.orders.length){
            return true;
          }
        }

        vm.backToCart = function(){
          $state.go('cart', { userid: vm.userid} );
        }

      }//OrdersController



})();
