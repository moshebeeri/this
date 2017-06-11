// region Export

module.exports = function(modelContainer, namespace){
	let metadataGenerator = require('./metadataGenerator.js')(namespace || 'models.app'),
    	dbManager         = require('./dbManager.js')(modelContainer, namespace || 'models.app');


	return {
	    getMetadata: metadataGenerator.getMetadata,
	    saveChanges: dbManager.saveChanges
	};
};

// endregion
