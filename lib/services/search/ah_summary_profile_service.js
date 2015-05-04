var jsonquery = require('json-query');
var http = require('http');
var config = require('../../../build_env_config');
var logger = require("../../config/logger/logger");

module.exports = function(req, res, cb) {
	var getHeaders = {
		'Content-Type' : 'application/json'
	};
	var options = {
		host : config.service_call_base_url.host,
		port : config.service_call_base_url.port,
		path : "/qsupport/userprofile/getSummary" + "/" + req.param('fiId')
				+ "/" + req.param('accountId') + "/" + req.param('ahPhone'),
		headers : getHeaders,
		method : 'GET'
	};
	var reqGet = http.request(options, function(wsResponse) {
		var summaryResponse = "";
		var jsonResponse = "";
		wsResponse.on('data', function(data) {
			summaryResponse += data;
		});
		wsResponse.on('end', function(data) {
			jsonResponse = JSON.parse(summaryResponse);
			if (jsonResponse.httpStatus == "BAD_REQUEST") {
				logger.error("AH Summary Profile Service Response: ", jsonResponse.errorMessage);
				res.status(res.statusCode).set(jsonResponse.erroMessage);
				return cb(jsonResponse, null);
			}
			return cb(null, jsonResponse);
		});
	});

	reqGet.on('error', function(e) {
		logger.error('problem with request: ' + e.message);
		return cb(e.message, null);
	});

	reqGet.end();
}
