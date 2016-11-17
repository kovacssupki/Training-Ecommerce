(function(){
  'use strict';
    angular
      .module('app')
      .controller('RegisterController', RegisterController)



      RegisterController.$inject = ['$scope','$http', 'authToken','alert','$state','$stateParams'];

      function RegisterController($scope, $http, authToken, alert, $state, $stateParams){
        var vm = this;
        vm.user = {};
        vm.isAuthenticated = authToken.isAuthenticated;
        vm.logoPath = '/client/assets/img/logo.png';

        vm.register = function(){

          $http.post('/user/register', vm.user, {headers:{'Content-Type': 'application/json' }})
          .success(function(response){
            authToken.setToken(response.token);
            alert('success ','Ok! ', 'Welcome ' + vm.user.email +'. Check your email for completing your registration!');
            $state.go('main');

          })
          .error(function(err){
            alert('warning','Oopss!', 'Could not register :( ', err.message);
          })

        }//register fn

      }//RegisterController






})();
