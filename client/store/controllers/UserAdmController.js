(function(){
  'use strict';
    angular
      .module('app')
      .controller('UserAdmController', UserAdmController)


      UserAdmController.$inject = ['$scope','$state','alert','$http','authToken','API_URL'];

      function UserAdmController($scope, $state, alert, $http, authToken, API_URL){
        var vm = this;
        vm.logoPath = '/client/assets/img/logo.png';
        vm.token = authToken.getToken();
        vm.enabled;

        if(vm.token){
          vm.isAuthenticated = authToken.isAuthenticated;
          vm.users = $http.get('/users').success(function(response){
            vm.users = response.users;
            console.log('Got users in vm.users', vm.users);
          })
        }else{
          alert('warning','You are not logged in!');
        }


        vm.enableUser = function(user){
          $http.post('/user/enable/'+ user._id, { userId: user._id}).success(function(response){
            console.log('success enabling user');
          })
        }//enable user

        vm.disableUser = function(user){
          $http.post('/user/disable/'+ user._id, { userId: user._id}).success(function(response){
            console.log('success disabling user');
          })
        }//disable user

        vm.resetPass = function(user){
            alert('success','Mail with new pass sent!');
            $http.post('/user/resetPassword', { userId: user._id}).success(function(response){
              console.log('Password resetted');
            })
        }

        vm.backHome = function(){
          $state.go('main')
        }


      }//UserAdmController



})();
