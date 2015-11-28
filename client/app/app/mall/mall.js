'use strict';

angular.module('lowlaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mall', {
        url: '/mall',
        templateUrl: 'app/mall/mall.html',
        controller: 'MallCtrl'
      });
  });