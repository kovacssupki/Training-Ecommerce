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

        vm.backToStore = function(){
          $state.go('main');
        }

      }//JobsController



})();
