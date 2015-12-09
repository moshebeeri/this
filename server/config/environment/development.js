'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/lowla-dev'
  },

  aws: {
    key: 'XXXXXXXXXXXX',
    secret: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    region: 'us-east',
    bucketName: 'ThisCounts'
  },

  seedDB: true
};
