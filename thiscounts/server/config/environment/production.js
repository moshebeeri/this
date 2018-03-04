'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGODB_URI ||
            process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/lowla'
  },
  neo4j: {
    uri:    process.env.NEO4J_URI ||
            'http://localhost:7474'
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
    index: 'lowla'
  },

  google_maps:{
    key: 'AIzaSyACe_Cci4drnZovD8xjJOdrsIOQwyWSyCg',

  },
  pricing:{
    freeTier: 5000,
    CPM: 1
  },
  initializeNeo4j: true,
  sms_verification: true
};
