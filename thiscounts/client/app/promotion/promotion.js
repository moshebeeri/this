'use strict';

angular.module('lowlaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('promotion', {
        url: '/promotion',
        templateUrl: 'app/promotion/promotion.html',
        controller: 'PromotionCtrl'
      });
  });