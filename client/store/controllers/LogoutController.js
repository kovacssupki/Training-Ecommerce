(function(){
  'use strict';
  angular
    .module('app')
    .controller('LogoutController', LogoutController)

    LogoutController.$inject = ['$scope','authToken','$state'];

    function LogoutController($scope, authToken, $state){
      var vm = this;

      authToken.removeToken();
      $state.go('main');

    }
})();
