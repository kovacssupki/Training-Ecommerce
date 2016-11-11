(function() {
  'use strict';

  angular
    .module('app.store')
    .config(storeConfig);

    storeConfig.$inject = ['$stateProvider'];

    function storeConfig($stateProvider){
        $stateProvider
            .state( 'home',{
                url:'^/home',
                parent: 'default',
                views:{
                    'default':{
                        controller:'StoreController',
                        controllerAs:'vm',
                        templateUrl:'client/store/views/store.html'
                    }
                },
                resolve:{
                  products:['$stateParams','$http', function($stateParams,$http){
                    return $http.get('/products').then(function(response){
                      console.log('response of resolved products array from route is:', response.data);
                      if(response.data.status === 'success'){
                        return response.data.products;
                      }else{
                        //todo error interceptor
                      }

                    });
                  }]

                }

        });
    }

})();

// doar asa stie sa rezolve , daca e declarat si controller-ul in state!
