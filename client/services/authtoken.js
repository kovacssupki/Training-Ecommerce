(function(){
  'use strict'
  angular
    .module('app')
    .factory('authToken', function($window){
      var storage = $window.localStorage;
      var cachedToken;
      return {
        setToken: function(token){
          cachedToken = token;
          storage.setItem('userToken', token);
        },
        getToken: function(){
          if(!cachedToken){
            cachedToken = storage.getItem('userToken');
          }
          return cachedToken;
        },
        isAuthenticated: function(){
          return !!this.getToken();//returns true if we get something from getToken method (double-not operator)
        }
      }
    })//factory end
})();
