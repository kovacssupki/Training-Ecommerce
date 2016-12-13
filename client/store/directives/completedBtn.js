(function(){
  'use strict'
  angular
    .module('app')
    .directive('completedBtn', function completedBtn($http){
      return {
       restrict: 'E',
       scope: {
         order:'='
       },
       templateUrl: 'client/store/views/completedBtn.html',

       link: function(scope, element, attrs) {
         //I have the order object because I poked that hole(:>) in the isolated scope,
         //sending the whole order via the order attribute in the html of this directive
          if(scope.order.completed){
            scope.buttonText = "Completed";
            scope.installed = true;
          }else{
            scope.buttonText = "Pending";
            scope.installed = false;
          }

         scope.switch = function(){
          scope.orderId = scope.order._id;
          $http.put('/order/'+ scope.orderId + '/complete',  { orderId: scope.orderId}).success(function(response){
            console.log('order completed succesfully');
          })
          .then(onsuccessCallback,onerrorCallback)
          function onsuccessCallback(){
            scope.buttonText = "Completed";
            scope.installed = true;
          }
          function onerrorCallback(){
            console.log('Error occured');
          }

         }

     }//link fn

    }//returned object

  })//completedBtn fn
})();
