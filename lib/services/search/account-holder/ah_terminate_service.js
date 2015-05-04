
var http = require('http');
var config = require('../../../../build_env_config');
var logger = require("../../../config/logger/logger");
var ap_module_name = '<ah_terminate_service>';

module.exports = function(req, res, cb) {
    logger.info(ap_module_name, '%sAH Terminate Request admin:, account holder id: {}',req.user, req.param('ahId'));
    logger.info('Close Account Service: ',config.service_call_base_url.host+':'+config.service_call_base_url.port);
    var getHeaders = {
        'Content-Type' : 'application/json',
        'adminEmailId': req.user
    };
    var options = {
        host : config.service_call_base_url.host,
        port : config.service_call_base_url.port,
        path : "/qsupport/deleteAccount/accountHolder/"+req.param('ahId'),
        headers : getHeaders,
        method : 'delete'
    };
    var reqGet = http.request(options, function(res) {
        var terminateAccountResponse = "";
        res.on('data', function(data) {
            terminateAccountResponse += data;
        });
        res.on('end', function(data) {
            if (res.statusCode != 200) {
                console.log("AH Terminate Account Service Response: ", res.statusCode);
                return cb(res.statusCode, null);
            }
            var results = {};
            results = JSON.parse(terminateAccountResponse);
            return cb(null, results);
        });
    });

    reqGet.on('error', function(e) {
        logger.info('problem with request: ' + e.message);
        return cb(e.message, null);
    });

    reqGet.end();
}
