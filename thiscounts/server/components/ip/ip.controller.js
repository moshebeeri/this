var requestIp = require('request-ip');

// Get client ip
exports.index = function(req, res) {
	var clientIp = requestIp.getClientIp(req);
	return res.status(200).json(clientIp);
};