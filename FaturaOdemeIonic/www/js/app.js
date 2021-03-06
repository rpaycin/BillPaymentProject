// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'app.sqlite', 'ion-sticky', 'app.helperMethods', 'ui.mask'])
.config(function ($ionicConfigProvider) {
    //Added config
    //$ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.tabs.position('bottom'); // other values: top

    //geri buton text
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);

    $ionicConfigProvider.navBar.alignTitle('center');
})
.run(function ($ionicPlatform, DB, $rootScope) {
    $rootScope.currentPlatform = ionic.Platform.platform();
    $rootScope.emailAddress = "";

    $rootScope.paymentBillBasket = [];

    $ionicPlatform.ready(function () {     
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        ionic.Platform.isFullScreen = true;

        //db olu�turma
        DB.init();
    });
})
