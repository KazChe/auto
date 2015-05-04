
var http = require('http');
var config = require('../../../build_env_config');
var logger = require("../../config/logger/logger");
var module_name = ' <ah_transaction_detail_service> ';

module.exports = function(req, res, cb) {
	//TODO: verify exact service end-point and params
	logger.info(module_name, 'is entered ', "/qsupport/transaction/getTransactionDetail/"+req.body.fiId+"/"+req.body.trxId +"/"+ req.body.refTrxId)
	var getHeaders = {
		'Content-Type' : 'application/json'
	};
	var options = {
		host : config.service_call_base_url.host,
		port : config.service_call_base_url.port,
		path : "/qsupport/transaction/getTransactionDetail/"+req.body.fiId+"/"+req.body.trxId +"/"+ req.body.refTrxId,
		headers : getHeaders,
		method : 'GET'
	};
	var reqGet = http.request(options, function(response) {
		var serviceResponse = "";
		response.on('data', function(data) {
			serviceResponse += data;
		});
		response.on('end', function(data) {
			if (response.statusCode != 200) {
				logger.error(module_name, "AH Summary Transaction Detail Service Response: ", response.statusCode);
				res.status(400).set('Bad Request');
				return cb(response.statusCode, null); //TODO: inspect for error message(s)
			}
			return cb(null, serviceResponse);
		});
	});

	reqGet.on('error', function(e) {
		logger.error(module_name, 'problem with request: ' + e.message);
		return cb(e.message, null);
	});
	reqGet.end();
}