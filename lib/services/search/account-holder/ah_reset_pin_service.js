var http = require('http');
var config = require('../../../../build_env_config');
var logger = require("../../../config/logger/logger");
var ap_module_name = ' <ah_reset_pin_service> '

module.exports = function (req, res, cb) {

    logger.info('calling login service host: ', config.service_call_base_url.host,config.service_call_base_url.port);

    var postHeaders = {
        'Content-Type': 'application/json'
    };

    var options = {
        host: config.service_call_base_url.host,
        port: config.service_call_base_url.port,
        path: "/mas/rest/resetPin",
        headers: postHeaders,
        method: 'POST',
        data: req.body.ahId
    };
    var reqPost = http.request(options, function (wsResponse) {
        var resetPinResponse = "";
        wsResponse.on('data', function (d) {
            resetPinResponse += d;
        });
        wsResponse.on('end', function () {
            if(wsResponse.statusCode != 200) {
                res.status(res.statusCode).set('Bad Request');
                return cb(resetPinResponse, null);
            }
            var results = {};
            //results.user = JSON.parse(resetPinResponse);
            return cb(null, resetPinResponse);

        })
    });
    reqPost.write(options.data);
    reqPost.end();
    reqPost.on('error', function (e) {
        return cb(e, null);
    });
}
