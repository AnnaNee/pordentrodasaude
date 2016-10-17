// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic.wizard', 'ngCordova', 'google.places'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('main', {
        url: '/start',
        abstract: true,
        template: '<ion-nav-view></ion-nav-view>'
    })

    .state('main.intro', {
        url: '/intro',
        templateUrl: 'templates/intro.html',
        controller: 'IntroController'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })

    .state('sign-up', {
        url: '/cadastrar',
        templateUrl: 'templates/sign-up.html',
        controller: 'SignUpController'
    })

    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    .state('tab.dashboard', {
      url: '/dashboard',
      views: {
        'tab-dashboard': {
          templateUrl: 'templates/tab-dashboard.html',
          controller: 'DashboardController'
        }
      }
    })

    .state('tab.reviews', {
      url: '/reviews',
      views: {
        'tab-reviews': {
          templateUrl: 'templates/tab-reviews.html',
          controller: 'ReviewsController'
        }
      }
    })

    .state('tab.chat-detail', {
      url: '/reviews/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.faq', {
      url: '/faq',
      views: {
        'tab-faq': {
          templateUrl: 'templates/tab-faq.html',
          controller: 'FaqController'
        }
      }
    })

    .state('tab.profile', {
      url: '/profile',
      views: {
        'tab-profile': {
          templateUrl: 'templates/tab-profile.html',
          controller: 'ProfileController'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/start/intro');

});
