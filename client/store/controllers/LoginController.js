(function(){
  'use strict';
    angular
      .module('app')
      .controller('LoginController', LoginController)


      LoginController.$inject = ['$scope','$http', 'authToken','alert','API_URL','$state'];

      function LoginController($scope, $http, authToken, alert, API_URL, $state){

        var vm = this;
        vm.logoPath = '/client/assets/img/logo.png';
        vm.isAuthenticated = authToken.isAuthenticated;
        
        vm.url = API_URL + 'user/login';
        vm.user = {};


        vm.login = function(){


          $http.post(vm.url, vm.user)
          .success(function(res){
            alert('success','Thanks for coming back',', ' + res.user.username + '!');
            console.log('response is: ', res);
            authToken.setToken(res.token);
            vm.user = res.user;
            console.log('vm.user in LoginCtrl: ', vm.user)
            $state.go('main');
          })
          .error(function(err){
            alert('warning','Oopss!', 'Could not login :( ')
          })

        }//register fn

        function successCallback(response){
          console.log('response on successcallback is: ',response);
          return response.data;
        }
        function errorCallback(response){
          console.log('error');
        }




      }//RegisterController



})();
