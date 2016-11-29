(function(){
  'use strict';
    angular
      .module('app')
      .controller('OrdersController', OrdersController)


      OrdersController.$inject = ['$scope','$state','$stateParams','alert','$http','authToken','orders','allOrders'];

      function OrdersController($scope, $state, $stateParams, alert, $http, authToken, orders, allOrders){
        var vm = this;
        vm.logoPath = '/client/assets/img/logo.png';
        vm.isAuthenticated = authToken.isAuthenticated;
        vm.userid = $stateParams.userid;

        vm.orders = allOrders || orders;

        console.log('All orders:', allOrders)
        console.log('Orders:', orders)

        vm.loggedAdmin= function(){
          if(vm.userid === '58358c03abe49411b46c792a'){
            return true;
          }
        }

        vm.empty = function(){
          if (!vm.orders.length){
            return true;
          }
        }

        vm.confirm = function(order){
          var orderId = order._id;
          // console.log('order id: ', orderId);
          $http.put('/order/'+ orderId + '/confirm',  { orderId: orderId}).success(function(response){
            console.log('order modified succesfully');
          })
        }

        vm.reject = function(order){
          var orderId = order._id;
          $http.put('/order/'+ orderId + '/reject',{ orderId: orderId}).success(function(response){
            console.log('order modified succesfully');
          })
        }

        vm.confirmed = function(order){
          var orderConfirmed = order.confirmed;
          if (orderConfirmed) {
            return true;
          }
        }
        // vm.completed = function(order){
        //   var orderId = order._id;
        //   $http.put('/order/'+ orderId + '/reject',  { orderId: orderId}).success(function(response){
        //     console.log('order modified succesfully');
        //   })
        // }

        vm.backToCart = function(){
          $state.go('cart', { userid: vm.userid} );
        }

      }//OrdersController



})();
