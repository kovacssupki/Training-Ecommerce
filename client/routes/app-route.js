(function(){
    'use strict'
    angular
        .module('app')
        .config(appConfig);

    appConfig.$inject=['$stateProvider', '$urlRouterProvider'];

    function appConfig($stateProvider, $urlRouterProvider){
        console.log('merge la url route!');
        $urlRouterProvider.otherwise('/store');

        $stateProvider
        // THIS IS THE FUCKING PARENT STATE
            .state('default', {
                url:'/',
                template:'<div ng-include="\'client/views/navigation.html\'"></div><div data-ui-view="default"></div>',
                controller:'NavController',
                controllerAs:'vm',
                params:{
                  id: null
                },
                resolve:{
                  user:['$stateParams','$http', function($stateParams,$http){
                    return $http.get('/user/'+ $stateParams.id).then(function(response){
                      if(response.data.status === 'success'){
                        return response.data.user;
                      }else{
                        console.log('errorrrrrrrrrrrr');
                      }
                    });
                  }]
                }
            })

        }
})();
