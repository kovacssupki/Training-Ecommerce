(function(){
    'use strict'
    angular
        .module('app.store')
        .controller('StoreController', StoreController)


    StoreController.$inject = ['$scope','$http','$state','products','alert','$uibModal','$stateParams','users','user'];

    function StoreController($scope, $http, $state, products, alert, $uibModal, $stateParams, users, user){
        var vm = this;
        vm.msg = 'hi from store ctrl';
        vm.products = products;
        vm.orderProp = 'age';
        // console.log(vm.products);
        // vm.id = $stateParams.id;
        // console.log('vm.id in storeCtrl: ', vm.id);
        
        vm.users = users;
        console.log('users in storeCtrl',users);
        vm.user = user;
        console.log('user in storeCtrl',user);

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
          // $state.go('cart');
        }

    }//StoreController




})();
