(function(){
    'use strict'
    angular
        .module('app.store')
        .controller('StoreController', StoreController)


    StoreController.$inject = ['$scope','$http','products'];

    function StoreController($scope, $http, products){
        var vm = this;
        vm.msg = 'hi from store ctrl';
        vm.products = products;
        console.log(vm.products);
    }//StoreController




})();
