(function(){
    'use strict'
    angular
        .module('app.store')
        .controller('StoreController', StoreController)


    StoreController.$inject = ['$scope','$http','products','alert'];

    function StoreController($scope, $http, products, alert){
        var vm = this;
        vm.msg = 'hi from store ctrl';
        vm.products = products;
        vm.orderProp = 'age';
        console.log(vm.products);
    }//StoreController




})();
