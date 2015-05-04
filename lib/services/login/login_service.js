var http  = require('http');
var couchbaseBucket =  require('../../helpers/couchbase/dbbucket')();
var searchCardMapper = require('../../helpers/access-type/search/searchCardMapper');
//var props = require('properties-parser').read('./lib/middleware/token/config/jwttoken.properties');
var props = require('properties-parser').read('./config/jwttoken.properties');
var config = require('../../../build_env_config');

module.exports = function (req, res, cb) {

    console.log('calling login service host: ', config.service_call_base_url.host,config.service_call_base_url.port);

    var postHeaders = {
        'Content-Type': 'application/json'
    };

    var options = {
        host: config.service_call_base_url.host,
        port: config.service_call_base_url.port,
        path: "/ap-services/rest/admin/v1/login",
        headers: postHeaders,
        method: 'POST',
        data: '{"email":"'+req.param("email")+'", "password":"'+req.param("password")+'"}'
    };
    var reqPost = http.request(options, function (wsResponse) {
        var loginResponse = "";
        wsResponse.on('data', function (d) {
            loginResponse += d;
        });
        wsResponse.on('end', function () {
            if(wsResponse.statusCode != 200) {
                return cb('Unauthorized', null);
            }
            var results = {};
            results.user = JSON.parse(loginResponse);
            if(results.user.adminStatus == 'ACTIVE') {
                searchCardMapper(results);
                //configureAllowedEndPoints(results);
                couchbaseBucket.upsert(results.user.email, results, {expiry:0}, function(err, response){
                    console.log("couchbase insert result: ", response, err);
                    //TODO: add error handling here!!!!
                })
                return cb(null, results);
            } else {
                return cb(results.user.adminStatus, null);
            }

        })
    });
    // write the json data
    reqPost.write(options.data);
    reqPost.end();
    reqPost.on('error', function (e) {
        return cb(e, null);
    });
}
