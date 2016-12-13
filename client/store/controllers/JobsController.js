(function(){
  'use strict';
    angular
      .module('app')
      .controller('JobsController', JobsController)


      JobsController.$inject = ['$scope','$http','alert','API_URL','authToken'];

      function JobsController($scope, $http, alert, API_URL, authToken){
        var vm = this;
        vm.logoPath = '/client/assets/img/logo.png';
        vm.token = authToken.getToken();

        if(vm.token){
          vm.isAuthenticated = authToken.isAuthenticated;
        }
      


        $http.get(API_URL + 'jobs').success(function(jobs){
          vm.jobs = jobs;
          if(vm.jobs.payload.name){
            vm.loggedUser = vm.jobs.payload.name;
          }
          console.log('vm.jobs',vm.jobs)
          console.log('vm.jobs.payload',vm.jobs.payload.name)


        }).error(function(err){
          alert('warning','Unable to get jobs', err.message);
        })



      }//JobsController



})();
