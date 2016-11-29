(function(){
    'use strict'
    angular
        .module('app.store')
        .controller('StoreController', StoreController)



    StoreController.$inject = ['$scope','$http','$state','products','alert','$stateParams','$uibModal','authToken','$rootScope','API_URL','CartService'];

    function StoreController($scope, $http, $state, products, alert, $stateParams, $uibModal, authToken, $rootScope, API_URL, CartService){
        var vm = this;

        vm.products = products;
        vm.orderProp = 'age';
        vm.logoPath = '/client/assets/img/logo.png';
        vm.isAuthenticated = authToken.isAuthenticated;
        vm.token = authToken.getToken();




        //get jobs + name
        $http.get(API_URL + 'jobs').success(function(jobs){
          vm.jobs = jobs;
          if(vm.jobs.payload.name){
            vm.loggedUser = vm.jobs.payload.name;
          }
          vm.userid = vm.jobs.payload.sub;

        }).error(function(err){
            alert('warning','Unable to get jobs! ', err.message);
        })
        //=get jobs + name end


        //Verify if user is logged, if so, invoke the service, if not err msg
        if(vm.token){
            CartService.loadCart(vm.userid).then(function(data){
              vm.cart = data;
              vm.cartProducts = data.user.cart;
              console.log('vm.cart in Store is: ', vm.cart)
              console.log('vm.cartProducts in Store is: ', vm.cartProducts)
              vm.itemCount = function(){
                var count = 0;
                for(var i = 0; i < vm.cartProducts.length; i++){
                  var item = vm.cartProducts[i];
                  var quantity = item.quantity;
                  count += quantity;
                }
                return { count : count};
              }//itemCount

              vm.totalCost = function(){
                var total = 0;
                for(var i=0; i< vm.cartProducts.length;i++){
                  var item = vm.cartProducts[i];
                  total = total + (item.quantity * item.itemId.price)
                }
                return {total:total};
              }//totalCost
            })

          // console.log('vm.cart in Store is: ', vm.cart)// aci nu exista

        }else{
          console.log('ur not logged noob');
        }



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

         $http.post('/cart/'+ vm.userid + '/additem/'+ product._id, { productId: product._id, userId: vm.userid, quantity: product.quantity, itemName: product.name}).success(function(response){
           console.log('Item that got added to cart is: ',response);
         }).then(onSuccessCallback, onErrorCallback)

         function onSuccessCallback(){
           $http.get('/cart/'+ vm.userid).success(function(response){
             vm.cartProducts = response.user.cart;
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
        modalInstance.result.then(function(data){
           vm.products.push(data);
        })
      }//vm.addProd

      vm.delete = function(product){
        var product = product;
        console.log('clicked product id:', product._id);
        $http.delete('/product/'+ product._id +'/delete').success(function(response){
          console.log('Deleted: ', response);
        }).then(successCallback,errorCallback)

        function successCallback(){
          vm.products = vm.products.filter(function(item){
            if (product._id !== item._id) {
              return item;
            }
          })

          console.log("Deleted product is: ", product);
          alert('success', 'Deleted product');
        }
        function errorCallback(){
          console.log('Error deleting product');
        }
      }

      vm.edit = function(product){
        // var selectedProduct = product;
        // console.log('selectedProduct:', product);
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'client/store/views/editModal.html',
          controller: 'EditController',
          controllerAs: 'vm',
          size: 'lg',
          resolve:{
            product: function(){
              return product;
            }
          }
        });

      }//vm.addProd

    }//StoreController




})();
