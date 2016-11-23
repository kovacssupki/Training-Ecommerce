(function(){
  'use strict';
    angular
      .module('app')
      .controller('CartController', CartController)


      CartController.$inject = ['$scope','$http','alert','API_URL','authToken','$state','$stateParams','cart'];

      function CartController($scope, $http, alert, API_URL, authToken, $state, $stateParams, cart){
        var vm = this;
        vm.logoPath = '/client/assets/img/logo.png';
        vm.isAuthenticated = authToken.isAuthenticated;
        vm.userid = $stateParams.userid;
        console.log('stateParams userid in Cart', $stateParams.userid);

        vm.cart = cart;
        console.log('vm.cart in CartCtrl', vm.cart)
        vm.cart.items = vm.cart.user.cart;
        console.log('vm.cart.items', vm.cart.items);

        vm.empty = function(){
          if (!vm.cart.items.length){
            return true;
          }
        }

        //get jobs + name
        $http.get(API_URL + 'jobs').success(function(jobs){
          vm.jobs = jobs;
          if(vm.jobs.payload){
            vm.loggedUser = vm.jobs.payload.name;
            vm.userId = vm.jobs.payload.sub;
          }
          console.log('vm.jobs',vm.jobs);
          console.log('vm.jobs.payload.name',vm.jobs.payload.name);
          console.log('vm.jobs.payload.sub',vm.jobs.payload.sub);

        }).error(function(err){
            alert('warning','Unable to get jobs', err.message);
        })
        //=get jobs + name end

        vm.removeItem = function(item){
          var product = item;
          // console.log('clicked:', product);
          $http.delete('/cart/'+ vm.userid +'/removeitem/'+ product._id).success(function(response){
            console.log('Deleted: ', response);
          }).then(successCallback,errorCallback)
          function successCallback(){
             alert('success', 'Item removed from cart');
             $http.get('/cart/'+ vm.userid).success(function(response){
               vm.cart.items = response.user.cart;
               console.log('vm.cart in cartCtrl is :',vm.cart);
             });
          }
          function errorCallback(){
            console.log('Error removing item from cart');
          }


        }//removeItem

        vm.itemCount = function(){
          var count = 0;
            for(var i = 0; i < vm.cart.items.length; i++){
              var item = vm.cart.items[i];
              var quantity = item.quantity;
              count += quantity;
            }
          return { count : count};
        }//itemCount
        vm.totalCost = function(){
          var total = 0;
          for(var i=0; i< vm.cart.items.length;i++){
            var item = vm.cart.items[i];
            total = total + (item.quantity * item.itemId.price)
          }
          return {total:total};
        }//totalCost

        vm.goToOrders = function(){
          $state.go('orders', { userid: vm.userid} );
        }


        vm.checkout = function(){
          console.log('checkout clicked');

          $http.get('/order/'+ vm.userId +'/create').success(function(response){
            console.log('Order is: ',response);
          }).then(onSuccessCallback, onErrorCallback)

          function onSuccessCallback(err, doc){
            $http.get('/cart/'+ vm.userid).success(function(response){
              vm.cart.items = response.user.cart;
            });
            alert('success','Order made');
          }
          function onErrorCallback(error){
            console.log('Error checking out');
          }
        }

        vm.backToStore = function(){
          $state.go('main');
        }

      }//JobsController



})();
