(function(){
  'use strict';
    angular
      .module('app')
      .controller('AddController', AddController)


      AddController.$inject = ['$scope','$state','$stateParams','alert','$http','authToken','FileUploader','$uibModalInstance',];

      function AddController($scope, $state, $stateParams, alert, $http, authToken, FileUploader, $uibModalInstance){
        var vm = this;
        $scope.uploadedFile = [];

        vm.addProd = function(){
          vm.product.imageUrl = $scope.uploadedFile.length ? $scope.uploadedFile[0].file.name
          : 'default-user.png';
          $http.post('/product/create', vm.product ).success(function(response){
            console.log("Added product:", vm.product);
            alert('success', 'Added product!');
            console.log('response: ',response);
            vm.product = response;
            $uibModalInstance.close(vm.product);
          })
        }

        // UPLOAD IMG
      var uploader = $scope.uploader = new FileUploader({
         url: '/uploads'
       });

      uploader.onSuccessItem = function(fileItem, response, status, headers) {
           console.info('onSuccessItem', fileItem, response, status, headers);
           console.log('FileItem is', fileItem);
           $scope.uploadedFile.push(fileItem);
       };
      //  console.info('uploader', uploader);

    }//AddController



})();
