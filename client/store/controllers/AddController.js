(function(){
  'use strict';
    angular
      .module('app')
      .controller('AddController', AddController)


      AddController.$inject = ['$scope','$state','$stateParams','alert','$http','authToken'];

      function AddController($scope, $state, $stateParams, alert, $http, authToken){
        var vm = this;

        vm.addProd = function(){
          $http.post('/product/create', vm.product ).success(function(response){
            console.log("Added product:", vm.product);
            alert('success', 'Added product!');
            
          })
        }
      }//AccordionController



})();
