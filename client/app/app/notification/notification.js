'use strict';

angular.module('lowlaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('notification', {
        url: '/notification',
        templateUrl: 'app/notification/notification.html',
        controller: 'NotificationCtrl'
      });
  });