'use strict';

var Campaign = require('./campaign');

exports.createCampaign = function createCampaign(params) {
  return new Campaign(params);
};
