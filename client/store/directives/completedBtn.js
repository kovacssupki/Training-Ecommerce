(function(){
  'use strict'
  angular
    .module('app')
    .directive('completedBtn', completedBtn)

    function completedBtn(){
      return {
       restrict: 'E',
       scope: {},
       templateUrl: '../views/completedBtn.html',

       link: function(scope, element, attrs) {
          scope.buttonText = "Install",
          scope.installed = false,

          scope.download = function() {
           element.toggleClass('btn-active');
           if(scope.installed) {
             scope.buttonText = "Install";
             scope.installed = false;
           } else {
             scope.buttonText = "Uninstall";
             scope.installed = true;
           }
         }//download
     }//link fn
    }//returned object
  }//completedBtn fn
})();
