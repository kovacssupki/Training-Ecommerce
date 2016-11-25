(function(){
  'use strict'
  angular
    .module('app')
    .service('CartService', CartService);//service end

    function CartService($http){
      this.loadCart = function(userId){
         return $http.get('/cart/'+ userId)
          .then(function(response){
            console.log('coming from service: ', response.data);
            return response.data
          })
      };
    }//CartService
})();
