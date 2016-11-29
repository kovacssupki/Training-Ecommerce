(function(){
    'use strict'
    angular
        .module('app')
        .config(appConfig)
        .constant('API_URL','http://localhost:3000/')


    appConfig.$inject=['$stateProvider', '$urlRouterProvider','$httpProvider'];

    function appConfig($stateProvider, $urlRouterProvider, $httpProvider){
        console.log('merge la url route!');
        $urlRouterProvider.otherwise('/'); // '/store'

        $stateProvider
        // THIS IS THE FUCKING PARENT STATE
            .state('main', {
                url:'/',

                templateUrl:'client/store/views/store.html',
                controller:'StoreController',
                controllerAs:'vm',
                resolve:{
                   products:['$stateParams','$http', function($stateParams,$http){
                     return $http.get('/products').then(function(response){
                       console.log('response of resolved products array from route is:', response.data);
                       if(response.data.status === 'success'){
                         return response.data.products;
                       }else{
                         console.log('Error resolving the products from route');
                       }
                     })
                   }]


             }//resolve

            })
            .state('register',{
                url:'/register',
                templateUrl:'client/store/views/register.html',
                controller:'RegisterController',
                controllerAs:'vm'
            })

            .state('login',{
                url:'/login',
                templateUrl:'client/store/views/login.html',
                controller:'LoginController',
                controllerAs:'vm'
            })

            .state('logout',{
              url:'/logout',
              controller:'LogoutController',
              controllerAs:'vm'
            })
            .state('jobs',{
              url:'/jobs',
              templateUrl:'client/store/views/jobs.html',
              controller:'JobsController',
              controllerAs:'vm'
            })

            .state('activation', {
              url:'/activate/:code/:username',
              templateUrl:'client/store/views/activate.html',
              controller:'ActivationController',
              controllerAs:'vm',
              resolve:{
                code:['$stateParams','$http', function($stateParams, $http){
                  return $http.get('/activate/' + $stateParams.code + '/' + $stateParams.username).then(function(response){
                      return response.data;
                  })
                }]
              }
            })
            .state('cart', {
              url:'/cart/:userid',
              templateUrl:'client/store/views/cart.html',
              controller:'CartController',
              controllerAs:'vm',
              resolve:{
                cart:['$stateParams','$http', function($stateParams, $http){
                  return $http.get('/cart/'+ $stateParams.userid ).then(function(response){
                    console.log(response.data);
                    return response.data;
                  })
                }]
              }
            })
            .state('orders', {
              url:'/cart/:userid/orders',
              templateUrl:'client/store/views/orders.html',
              controller: 'OrdersController',
              controllerAs:'vm',
              // params:{
              //   userId: null
              // },
              resolve:{
                cart:['$stateParams','$http', function($stateParams, $http){
                  return $http.get('/cart/'+ $stateParams.userid ).then(function(response){
                    // console.log(response.data);
                    return response.data;
                  })
                }],
                orders:['$stateParams','$http', function($stateParams, $http){
                  return $http.get('/orders/'+ $stateParams.userid).then(function(response){
                    console.log("user orders: ",response.data);
                    return response.data.orders;
                  })
                }],
                allOrders:['$stateParams','$http', function($stateParams, $http){
                  return $http.get('/orders/'+ $stateParams.userid + '/list').then(function(response){
                    console.log("all orders", response.data);
                    return response.data.orders;
                  })
                }]
              }
            })

            $httpProvider.interceptors.push('authInterceptor');
            console.log($httpProvider.interceptors);
        }






})();
