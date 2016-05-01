'use strict';

angular.module('lowlaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('campaign', {
        url: '/campaign',
        templateUrl: 'app/campaign/campaign.html',
        controller: 'CampaignCtrl'
      });
  });