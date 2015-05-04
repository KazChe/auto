var jsonquery = require('json-query');
var http = require('http');
var config = require('../../../build_env_config');
var logger = require("../../config/logger/logger");
var module_name = ' <ah_transaction_summary_service> ';

module.exports = function(req, res, cb) {
	logger.info(module_name, 'is entered ', "/qsupport/transaction/getTransactionList/" +req.body.fiId +"/"+ req.body.ahId +"/"+ req.body.month)
	var getHeaders = {
		'Content-Type' : 'application/json'
	};
	var options = {
		host : config.service_call_base_url.host,
		port : config.service_call_base_url.port,
		path : "/qsupport/transaction/getTransactionList/" +req.body.fiId +"/"+ req.body.ahId +"/"+ req.body.month, // +"/"+startDate/+endDate
		headers : getHeaders,
		method : 'GET'
	};
	var reqGet = http.request(options, function(res) {
		var serviceResponse = "";
		res.on('data', function(data) {
			serviceResponse += data;
		});
		res.on('end', function(data) {
			if (res.statusCode != 200) {
				logger.error(module_name, "AH Summary Transaction Service Response: ", res.statusCode);
				return cb('System Error', null); //TODO: inspect for error message(s)
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
