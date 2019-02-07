angular.module('app.modal.controllers',[])

.controller('CorporationListCtrl', function ($scope) {
    $scope.hideSelectList = function () {
        $scope.CorporationListCtrl.hide();
    };

})

.controller('CheckBillPaymentListCtrl', function ($scope) {
    $scope.hideSelectList = function () {
        $scope.CheckBillPaymentListCtrl.hide();
    };

});
