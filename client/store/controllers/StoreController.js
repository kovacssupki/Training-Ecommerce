(function(){
    'use strict'
    angular
        .module('app.store')
        .controller('StoreController', StoreController)



    StoreController.$inject = ['$scope','$http','$state','products','alert','$stateParams','$uibModal','authToken','$rootScope','API_URL','cart'];

    function StoreController($scope, $http, $state, products, alert, $stateParams, $uibModal, authToken, $rootScope, API_URL, cart){
        var vm = this;
        vm.msg = 'hi from store ctrl';
        vm.products = products;
        vm.orderProp = 'age';
        vm.logoPath = '/client/assets/img/logo.png';
        vm.isAuthenticated = authToken.isAuthenticated;
        // vm.name = $stateParams.username;
        vm.token = authToken.getToken();

        vm.cart = cart;
        vm.cart.items = vm.cart.user.cart;
        // console.log('vm.token in storeCtrl is: ', vm.token);
        // console.log('cart in Store: ', vm.cart);
        // console.log('items in store Cart: ', vm.cart.user.cart);

        //get jobs + name
        $http.get(API_URL + 'jobs').success(function(jobs){
          vm.jobs = jobs;
          if(vm.jobs.payload.name){
            vm.loggedUser = vm.jobs.payload.name;
          }
          vm.userid = vm.jobs.payload.sub;
          console.log('vm.userid', vm.userid);
          console.log('vm.jobs.payload.name',vm.jobs.payload.name);
        }).error(function(err){
            alert('warning','Unable to get jobs! ', err.message);
        })
        //=get jobs + name end

        vm.details = function(product){
         vm.product = product;
         var modalInstance = $uibModal.open({
           animation: true,
           ariaLabelledBy: 'modal-title',
           ariaDescribedBy: 'modal-body',
           templateUrl: 'client/store/views/detailsModal.html',
           controller: 'detailsController',
           controllerAs: 'vm',
           size: 'lg',
           resolve : {
             product : function(){
               return vm.product;
             }
           }
         });
       }

       vm.addToCart = function(product){
         var product = product;
        //  console.log('clicked product:', product);

         $http.post('/cart/'+ vm.userid + '/additem/'+ product._id, { productId: product._id, userId: vm.userid, quantity: product.quantity, itemName: product.name}).success(function(response){
           console.log('Item that got added to cart is: ',response);
         }).then(onSuccessCallback, onErrorCallback)

         function onSuccessCallback(){
           $http.get('/cart/'+ vm.userid).success(function(response){
             vm.cart.items = response.user.cart;
             console.log('vm.cart in store is :',vm.cart);
           });
           alert('success','Added '+ product.quantity+ " " + product.name + ' to cart');
         }

         function onErrorCallback(){
           console.log('Error adding user');
         }


       }//adtoCart


        vm.goToCart = function(){
          $state.go('cart', { userid: vm.userid} );
        }
        // console.log('items in store Cart: ', vm.cart.user.cart);

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

      vm.addQ = function(product){
        product.quantity +=1;
      }//addQ

      vm.subQ = function(product){
        if(product.quantity <= 0){
          return;
        }
        product.quantity -=1;
      }//subQ

      // ADMIN functionalities
      vm.checkLogged = function(){
        if(vm.loggedUser === 'admin'){
          return true;
        }
      }
      vm.add = function(){
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'client/store/views/addModal.html',
          controller: 'AddController',
          controllerAs: 'vm',
          size: 'lg',
        });

      }//vm.addProd

    }//StoreController




})();
