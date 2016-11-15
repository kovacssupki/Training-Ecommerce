<<<<<<< HEAD
// (function() {
//   'use strict';
//
//   angular
//     .module('app.store')
//     .config(storeConfig);
//
//     storeConfig.$inject = ['$stateProvider'];
//
//     function storeConfig($stateProvider){
//         $stateProvider
//             .state('store',{
//                 url:'^/store',
//                 parent: 'default',
//                 views:{
//                     'default':{
//                         controller:'StoreController',
//                         controllerAs:'vm',
//                         templateUrl:'client/store/views/store.html'
//                     }
//
//                 },
//                 params : {
//                   id: null,
//                   email : null,
//                 },
//                 resolve:{
//                   products:['$stateParams','$http', function($stateParams,$http){
//                     return $http.get('/products').then(function(response){
//                       console.log('response of resolved products array from route is:', response.data);
//                       if(response.data.status === 'success'){
//                         return response.data.products;
//                       }else{
//                         //todo error interceptor
//                       }
//
//                     });
//                   }],
//                   users:['$stateParams','$http', function($stateParams,$http){
//                     return $http.get('/users').then(function(response){
//                       console.log('response of resolved users array from route is:', response.data);
//                       if(response.data.status === 'success'){
//                         return response.data.users;
//                       }else{
//                         console.log('errorrrrrrrrrrrr');
//                       }
//                     })
//                   }]
//                 }//resolve end
//
//         })
//         // .state('cart',{
//         //   url: '/cart/:id',
//         //   parent:'default',
//         //   templateUrl:'client/store/views/cart.html',
//         //   controller:'CartController',
//         //   controllerAs: 'vm',
//         //   resolve:{
//         //     cart: ['$stateParams','$http', function($stateParams, $http){
//         //       return $http.get('/user/'+ $stateParams.id + '/cart').then(function(response){
//         //         return response.data;
//         //       })
//         //     }]
//         //   }
//         // })
//     }
//
// })();
//
// // doar asa stie sa rezolve , daca e declarat si controller-ul in state!
//
// // run phase : verific daca am in header x-auth-token
// //daca este, decodez cu JWT, si salvez datele in rootscope.currentUser
// //apoi, in app config, onstatechange, verific daca exista token, trebuie sa coincida rootscope.currentUser
=======
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
>>>>>>> 70425247f628429d21f7758a942827f465d3ccf3
