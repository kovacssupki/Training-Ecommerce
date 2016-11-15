(function(){
    'use strict'
    angular
        .module('app.store')
        .controller('StoreController', StoreController)


<<<<<<< HEAD
    StoreController.$inject = ['$scope','$http','$state','products','alert','$uibModal','$stateParams','authToken','$rootScope','API_URL'];

    function StoreController($scope, $http, $state, products, alert, $uibModal, $stateParams, authToken, $rootScope, API_URL){
        var vm = this;
        vm.msg = 'hi from store ctrl';
        vm.products = products;
        vm.orderProp = 'age';
        vm.logoPath = '/client/assets/img/logo.png';
        vm.isAuthenticated = authToken.isAuthenticated;
        vm.name = $stateParams.username;
        vm.token = authToken.getToken();

        vm.cart;
        console.log('vm.token in storeCtrl is: ', vm.token);



        //get jobs + name
        $http.get(API_URL + 'jobs').success(function(jobs){
          vm.jobs = jobs;
          if(vm.jobs.payload.name){
            vm.loggedUser = vm.jobs.payload.name;
          }
          vm.userid = vm.jobs.payload.sub;
          console.log('vm.userid', vm.userid)

          if(!vm.cart){
            // create the cart once user is logged in
            $http.post('/cart/'+ vm.userid + '/create',{ userid: vm.userid}).success(function(response){
              console.log('Cart that just got created',response);
              vm.cart = response;
              console.log('vm.cart in Store',vm.cart);
            })
          }else{
            $http.get('/cart/'+ vm.loggedUser).success(function(response){
              console.log('Current cart:', response);
            })
          }

          console.log('vm.jobs',vm.jobs)
          console.log('vm.jobs.payload.name',vm.jobs.payload.name)
        }).error(function(err){
            alert('warning','Unable to get jobs', err.message);
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

        vm.goToCart = function(){
          $state.go('cart', { username: vm.jobs.payload.name} );
        }

=======
    StoreController.$inject = ['$scope','$http','products'];

    function StoreController($scope, $http, products){
        var vm = this;
        vm.msg = 'hi from store ctrl';
        vm.products = products;
        console.log(vm.products);
>>>>>>> 70425247f628429d21f7758a942827f465d3ccf3
    }//StoreController




})();
