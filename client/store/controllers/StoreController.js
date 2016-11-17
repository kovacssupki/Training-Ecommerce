(function(){
    'use strict'
    angular
        .module('app.store')
        .controller('StoreController', StoreController)



    StoreController.$inject = ['$scope','$http','$state','products','alert','$stateParams','$uibModal','authToken','$rootScope','API_URL'];

    function StoreController($scope, $http, $state, products, alert, $stateParams, $uibModal, authToken, $rootScope, API_URL){
        var vm = this;
        vm.msg = 'hi from store ctrl';
        vm.products = products;
        vm.orderProp = 'age';
        vm.logoPath = '/client/assets/img/logo.png';
        vm.isAuthenticated = authToken.isAuthenticated;
        vm.name = $stateParams.username;
        vm.token = authToken.getToken();

        // vm.cart = cart;
        console.log('vm.token in storeCtrl is: ', vm.token);
        


        //get jobs + name
        $http.get(API_URL + 'jobs').success(function(jobs){
          vm.jobs = jobs;
          if(vm.jobs.payload.name){
            vm.loggedUser = vm.jobs.payload.name;
          }
          vm.userid = vm.jobs.payload.sub;
          console.log('vm.userid', vm.userid);
          // console.log('vm.jobs',vm.jobs);
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
         console.log('clicked product:', product);

         $http.post('/cart/'+ vm.userid + '/additem/'+ product._id, { productid: product._id, userid: vm.userid}).success(function(response){
           console.log('Item that got added to cart is: ',response);
         })
         alert('success','Added '+ product.name + ' to cart')
       }


        vm.goToCart = function(){
          $state.go('cart', { userid: vm.userid} );
        }


    }//StoreController




})();
