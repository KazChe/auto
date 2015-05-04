
var http         = require('http');
var config       = require('../../../build_env_config');
var logger       = require("../../config/logger/logger");
//var props        = require('properties-parser').read('./lib/middleware/token/config/jwttoken.properties');
var props        = require('properties-parser').read('./config/jwttoken.properties');
//var msg        = require('properties-parser').read('./lib/config/messages/messages.properties');
var msg        = require('properties-parser').read('./config/messages/messages.properties');

var couchbaseBucket = require('../../helpers/couchbase/dbbucket')();
var jsonQuery = require('json-query');

module.exports = function (req, res, adminData, cb) {

    var expectedEntityTypeId;
    var entityIdsJSON = {};
    var entityId;
    var entityTypeId;
    if(adminData.value.user.entityTypeId == 0) {
        if(!adminData.value.networks) {
            expectedEntityTypeId = 5;
            entityTypeId = adminData.value.user.entityTypeId;
            entityId = adminData.value.user.entityIds[0].entityId;
        } else if(adminData.value.networks && req.body.networkName) {
            expectedEntityTypeId = 1;
            entityTypeId = 5;
            entityIdsJSON.entityIds =  adminData.value.networks; //adminData.value.networks; //.map(function (a) {return a.entityId}).join(',')
            var id = jsonQuery('entityIds[entityName='+req.param('networkName').trim()+'].entityId', {
                data: entityIdsJSON
            })
            console.log('mapped ', req.param('networkName'), ' to id: ', id.value);
            entityId = id.value;
        } else {
            expectedEntityTypeId = 5;
            entityTypeId = adminData.value.user.entityTypeId;
            entityId = adminData.value.user.entityIds[0].entityId;
        }
    }
    if(adminData.value.user.entityTypeId == 5) {
        expectedEntityTypeId = 1;
        entityTypeId = adminData.value.user.entityTypeId;
        entityId = adminData.value.user.entityIds[0].entityId;
    }

    logger.info('user\'s entity type:', adminData.value.user.entityTypeId, 'entity id(s):',entityId, 'ExpectedEntityId:',expectedEntityTypeId );
    logger.info('service host: ', config.service_call_base_url.host);
    var postHeaders = {
        'Content-Type': 'application/json'
    };
    var options = {
        host: config.service_call_base_url.host,
        port: config.service_call_base_url.port,
        path: "/qsupport/search/entity",
        headers: postHeaders,
        method: 'POST',
        data: '{"expectedEntityTypeId":"' + expectedEntityTypeId + '","entityTypeId":"'
        + entityTypeId + '","entityId":"' + entityId + '","expectedSubEntityType":"' + msg.fi_subtype_ah_issuer +'"}'
	};
    logger.info('request data: ', options.data);
    var reqPost = http.request(options, function (wsResponse) {
        var searchentity_service_response = "";
        wsResponse.on('data', function (d) {
            searchentity_service_response += d;
        });
        wsResponse.on('end', function () {
            if (wsResponse.statusCode != 200) {
                console.log("Searchentity Response: ", wsResponse.statusCode);
                return cb('Unauthorized', null);
            }
            var results = {};
            results = JSON.parse(searchentity_service_response);
            if(adminData.value.user.entityTypeId == 0 && expectedEntityTypeId == 1) {
                return updateCouchbase(cb, results, adminData);
            }
            if(!adminData.value.networks || !adminData.value.fis) {
                return updateCouchbase(cb, results, adminData);
            } else {
                cb(null, results)
            }
        })
    });
    reqPost.write(options.data);
    reqPost.end();
    reqPost.on('error', function (e) {
        return cb(e, null);
    });

    function updateCouchbase(cb, results) {
        couchbaseBucket.get(req.user, function(err, response) {
            if(err) {
                console.log(err);
                return cb(err, null);
            }
            if(response) {
                if(adminData.value.user.entityTypeId == 5) {
                    response.value.fis = results
                } else if (adminData.value.user.entityTypeId == 0 && expectedEntityTypeId == 5) {
                    response.value.networks = results
                } else if (adminData.value.user.entityTypeId == 0 && expectedEntityTypeId == 1) {
                    response.value.fis = results;
                }
                couchbaseBucket.upsert(req.user, response.value, {expiry:1000}, function(err, response){
                    //console.log("couchbase insert result: ", response, err);
                })
                return cb(null, results);
            }
        });
    }
}
