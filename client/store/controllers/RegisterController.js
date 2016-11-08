(function(){
  'use strict';
    angular
      .module('app')
      .controller('RegisterController', RegisterController)


      RegisterController.$inject = ['$scope','$uibModalInstance','$http', 'authToken','alert'];

      function RegisterController($scope, $uibModalInstance, $http, authToken, alert){
        var vm = this;
        vm.user = {};


        vm.submit = function(){

          $http.post('/user/register', vm.user, {headers:{'Content-Type': 'application/json' }})
          .success(function(response){
          // console.log("User registered:", vm.user);
          authToken.setToken(response.token);
          alert('Success ','Ok! ', 'Welcome ' + vm.user.email +'. Check your email for completing your registration!');

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
