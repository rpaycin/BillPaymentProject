angular.module('app.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    //LOGIN
    //.state('tabsController', {
    //  url: '/page1',
    //  templateUrl: 'templates/tabsController.html',
    //  abstract:true
    //})

    //.state('tabsController.login', {
    //  url: '/page5',
    //  views: {
    //    'tab1': {
    //      templateUrl: 'templates/login.html',
    //      controller: 'loginCtrl'
    //    }
    //  }
    //})

    //.state('tabsController.signup', {
    //  url: '/page6',
    //  views: {
    //    'tab3': {
    //      templateUrl: 'templates/signup.html',
    //      controller: 'signupCtrl'
    //    }
    //  }
    //})

    //.state('tabsController.forgotPassword', {
    //    url: '/page15',
    //    views: {
    //        'tab1': {
    //            templateUrl: 'templates/forgotPassword.html',
    //            controller: 'forgotPasswordCtrl'
    //        }
    //    }
    //})

    .state('basketList', {
        url: '/basketList',
        params: {
            billPayingMenuIndex: 0
        },
        templateUrl: 'templates/basketList.html',
        controller: 'basketListCtrl',
        cache: false
    })

    .state('payment', {
        url: '/payment',
        params: {
            billPayingMenuIndex: 0
        },
        templateUrl: 'templates/payment.html',
        controller: 'paymentCtrl',
        cache: false
    })

    .state('finalPayment', {
        url: '/finalPayment',
        templateUrl: 'templates/finalPayment.html',
        controller: 'finalPaymentCtrl',
        cache: false
    })

    .state('billPayingMenu', {
        url: '/billPayingMenu',
        templateUrl: 'templates/billPayingMenu.html',
        controller: 'billPayingMenuCtrl'
    })

    .state('billPaying', {
        url: '/billPaying',
        params: {
            billPayingMenuIndex: 0
        },
        templateUrl: 'templates/billPaying.html',
        controller: 'billPayingCtrl',
        cache: false
    })

    .state('lastOperations', {
        url: '/lastOperations',
        templateUrl: 'templates/lastOperations.html',
        controller: 'lastOperationsCtrl'
    })

    .state('checkBills', {
        url: '/checkBills',
        templateUrl: 'templates/checkBills.html',
        controller: 'checkBillsCtrl'
    })

    .state('remindings', {
        url: '/remindings',
        templateUrl: 'templates/remindings.html',
        controller: 'remindingsCtrl'
    })

    .state('information', {
        url: '/information',
        templateUrl: 'templates/information.html',
        controller: 'informationCtrl',
        cache: false
    })

    $urlRouterProvider.otherwise('/billPayingMenu')
});
