(function(){
  'use strict';
    angular
      .module('app')
      .controller('AccordionController', AccordionController)


      AccordionController.$inject = ['$scope','$state','$stateParams','alert','$http','authToken'];

      function AccordionController($scope, $state, $stateParams, alert, $http, authToken){
        var vm = this;


      }//AccordionController



})();
