'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/lowla-dev'
  },

  aws: {
    key: 'AKIAJCUWYC5LA4HQRDEQ',
    secret: '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',
    region: 'us-east-1',
    bucketName: 'thiscounts'
  },

  //seedDB: true
  seedDB: false
};
