(function(){
    'use strict'
    angular
        .module('app')
<<<<<<< HEAD
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
                     });
                   }]
             }

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
              url:'/cart/:username',
              templateUrl:'client/store/views/cart.html',
              controller:'CartController',
              controllerAs:'vm',

              resolve:{
                // cart:['$stateParams','$http', function($stateParams, $http){
                //   return $http.get('/cart/' + $stateParams.username).then(function(response){
                //     console.log(response.data);
                //       return response.data;
                //   })
                // }]
              }
            })

            $httpProvider.interceptors.push('authInterceptor');
            console.log($httpProvider.interceptors);
        }



=======
        .config(appConfig);

    appConfig.$inject=['$stateProvider', '$urlRouterProvider'];

    function appConfig($stateProvider, $urlRouterProvider){
        console.log('merge la url route!');
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('default', {
                url:'/',
                template:'<div ng-include="\'/client/views/navigation.html \'"></div>\
                <div data-ui-view="default"></div>',
                controller:'NavController',
                controllerAs:'vm'
            })
        }
>>>>>>> 70425247f628429d21f7758a942827f465d3ccf3
})();
