'use strict';

angular.module('lowlaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('card', {
        url: '/card',
        templateUrl: 'app/card/card.html',
        controller: 'CardCtrl'
      });
  });