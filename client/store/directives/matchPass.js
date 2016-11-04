(function(){
  'use strict'
  angular
    .module('app')
    .directive('matchPass', matchPass)

    function matchPass(){
      return {
        require:'ngModel',
        link: function(scope, element, attrs){
          function validatePass(value){
            var valid = (value === scope.$eval(attrs.validateEquals));
            ngModelCtrl.$setValidity('equal', valid);
            return valid ? value : undefined;
          }
          ngModelCtrl.$parsers.push(validatePass);
          ngModelCtrl.$formatters.push(validatePass);

          scope.$watch(attrs.validatePass, function(){
            ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
          })
        }
      };
    }//sameAs fn
})();
