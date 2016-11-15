(function(){
  'use strict'
  angular
    .module('app')
    .factory('authInterceptor', function(authToken){
      return {
        request: function(config){
          var token = authToken.getToken();
          if(token)
            config.headers.Authorization = 'Bearer ' + token;
          return config;
        },
        response: function(response){
          var token = authToken.getToken();
          if(!token){
            //aici trebe sa il redirectez catre login din stateparams sau din rootscope sa sterg utilizatorul
          }
          return response;

        }
      }
    });

//This factory is responsible for intercepting our HTTP calls for the purpose of authorization

})();
