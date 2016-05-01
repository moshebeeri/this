'use strict';

angular.module('lowlaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cardType', {
        url: '/cardType',
        templateUrl: 'app/cardType/cardType.html',
        controller: 'CardTypeCtrl'
      });
  });