'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/lowla-dev'
  },
  neo4j: {
    uri: process.env.NEO4J_URI || 'http://localhost:7474'
  },
  aws: {
    key: 'AKIAJCUWYC5LA4HQRDEQ',
    secret: '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',
    region: 'us-east-1',
    bucketName: 'thiscounts'
  },

  twilio:{
    accountSid: 'ACc05b055681938f0a68791b2f2de08c08',
    authToken: '802246c68c545894b87bf2e31e026936',
    number: '+972526268723'
  },

  elasticsearch:{
    host: 'localhost:9200',
    log: 'trace',
    index: 'lowla-dev'
  },

  google_maps:{
    key: 'AIzaSyACe_Cci4drnZovD8xjJOdrsIOQwyWSyCg',

  },
  pricing:{
    freeTier: 5000,
    CPM: 1
  },
  seedDB: true,
  //seedDB: false,
  initializeNeo4j: true,
  sms_verification: false
};
