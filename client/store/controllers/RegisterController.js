(function(){
  'use strict';
    angular
      .module('app')
      .controller('RegisterController', RegisterController)


      RegisterController.$inject = ['$scope','$uibModalInstance','$http', 'authToken','alert','$state','$stateParams'];

      function RegisterController($scope, $uibModalInstance, $http, authToken, alert, $state,$stateParams){
        var vm = this;
        vm.user = {};


        vm.register = function(){

          $http.post('/user/register', vm.user, {headers:{'Content-Type': 'application/json' }})
          .success(function(response){
          authToken.setToken(response.token);
          alert('Success ','Ok! ', 'Welcome ' + vm.user.email +'. Check your email for completing your registration!');

        
          $state.go('store', { id : vm.user._id, email: vm.user.email });
          console.log($stateParams);

          $uibModalInstance.close(response);

          })
          .error(function(err){
            alert('Warning','Oops!', 'Could not register');
            $uibModalInstance.close(err);
          })

        }//register fn



        vm.cancel = function(){
          $uibModalInstance.close();
        }

      }//RegisterController



})();
