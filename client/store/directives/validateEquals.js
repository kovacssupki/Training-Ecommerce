(function(){
  'use strict'
  angular
    .module('app')
    .directive('validateEquals', validateEquals)

    function validateEquals(){
      return {
        require:'ngModel',//requires the ngModel controller
        link: function(scope, element, attrs, ngModelCtrl){
          function validateEqual(value){
            var valid = (value === scope.$eval(attrs.validateEquals));
            ngModelCtrl.$setValidity('equal', valid);
            return valid ? value : undefined;
          }
          ngModelCtrl.$parsers.push(validateEqual);
          ngModelCtrl.$formatters.push(validateEqual);

          scope.$watch(attrs.validateEquals, function(){
            ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
          })
        }
      };
    }//sameAs fn
})();

// https://www.nadeau.tv/using-ngmodelcontroller-with-custom-directives/
