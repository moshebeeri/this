let config = require('../../config/environment');
let mongoose = require('mongoose');
let dbConnection = mongoose.createConnection(config.mongo.uri);

let modelContainer = function getModel(model){ // the name of the model
 return dbConnection.model(model);
};

let dbSchemas = dbConnection['base']['models'];
let breezeMongoose = require('./breeze-mongoose')(modelContainer);

// Get list of models
exports.index = function(req, res) {
	return res.status(200).json(breezeMongoose.getMetadata(dbSchemas));
};

// Save list of models
exports.create = function(req, res) {
	breezeMongoose.saveChanges(req.body)
		.then(function(saveResults){
		 return res.status(200).json(saveResults);
	})
	.catch(function(message){
		return res.status(500).send(message);
	});
};
