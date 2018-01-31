/**
 * Main application file
 */

'use strict';
require('enum').register();

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let express = require('express');
let mongoose = require('mongoose');
let config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }
if(config.initializeNeo4j) { require('./config/initNeo4j'); }

// Setup server
let app = express();
//to disable 304 app.disable('etag');
let server = require('http').createServer(app);
let socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
module.exports = app;
