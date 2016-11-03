(function(){
    'use strict'
    angular
        .module('app')
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
})();
