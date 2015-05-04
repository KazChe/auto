var http = require('http');
var config = require('../../../../build_env_config');
var logger = require("../../../config/logger/logger");
var ap_module_name = ' <ah_unlock_service> '

module.exports = function (req, res, cb) {

    logger.info('Calling unlock service host:: ', config.service_call_base_url.host,config.service_call_base_url.port);

    var postHeaders = {
        'Content-Type': 'application/json'
    };

    var options = {
        host: config.service_call_base_url.host,
        port: config.service_call_base_url.port,
        path: "/mas/rest/unlockLockedOutAH/removeLock",
        headers: postHeaders,
        method: 'POST',
        data: '{"accountId":"' + req.body.ahId + '","adminEmailId":"'+ req.user +'"}'
    };
    var reqPost = http.request(options, function (wsResponse) {
        var unlockResponse = "";
        wsResponse.on('data', function (d) {
            unlockResponse += d;
        });
        wsResponse.on('end', function () {
            if(wsResponse.statusCode != 200) {
                return cb(wsResponse.statusCode, null);
            }
            logger.debug("Response::::::::::::: ", unlockResponse);
            return cb(null, unlockResponse);

        })
    });
    reqPost.write(options.data);
    reqPost.end();
    reqPost.on('error', function (e) {
        return cb(e, null);
    });
}
