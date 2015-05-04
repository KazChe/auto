
var jsonquery = require('json-query');
var http = require('http');
var config = require('../../../build_env_config');
var logger = require("../../config/logger/logger");

module.exports = function (req, res, adminData, cb) {
    var entityIds;
    var entityIdsJSON = {};
    var submittedFIName = req.param("fiName").trim();
    var userProfileEntityIds = adminData.value.user.entityIds;
    var userEntityTypeId = adminData.value.user.entityTypeId;

        if(userEntityTypeId == 5) {
            adminData.value.user.entityTypeId = "1"
            if (submittedFIName != 'All Financial Institutions') {
                entityIdsJSON.entityIds =  adminData.value.fis;
                var id = jsonquery('entityIds[entityName=' + submittedFIName + '].entityId', {
                    data: entityIdsJSON
                })
                logger.info('mapped ', submittedFIName, ' to id: ', id.value);
                entityIds = id.value;
            } else {
                entityIds =   adminData.value.fis.map(function (a) {return a.entityId}).join(',');
            }
        }
        if(userEntityTypeId == 0) {
            if(submittedFIName == 'All Financial Institutions' && req.param('networkName').trim() === 'All Networks') {
                entityIds = "";
            } else if(submittedFIName != 'All Financial Institutions' && req.param('networkName').trim() != 'All Networks') {
                entityIdsJSON.entityIds =  adminData.value.fis;
                var id = jsonquery('entityIds[entityName=' + submittedFIName + '].entityId', {
                    data: entityIdsJSON
                })
                logger.info('mapped ', submittedFIName, ' to id: ', id.value);
                adminData.value.user.entityTypeId = 1;
                entityIds = id.value;
            } else if(submittedFIName == 'All Financial Institutions' && req.param('networkName').trim() != 'All Networks') {
                entityIdsJSON.entityIds = adminData.value.fis.map(function (a) {return a.entityId}).join(',');
                logger.info('mapped All Financial Institutions to id(s): ', entityIdsJSON.entityIds);
                adminData.value.user.entityTypeId = 5; // Bad Kaz fix this. http request data: should be passed a variable
                entityIds = entityIdsJSON.entityIds;
                adminData.value.user.entityTypeId = "1";

            }
        }
        if (userEntityTypeId == 1) {
            if (submittedFIName != 'All Financial Institutions') {
                entityIdsJSON.entityIds = userProfileEntityIds;
                var id = jsonquery('entityIds[entityName=' + submittedFIName + '].entityId', {
                    data: entityIdsJSON
                })
                logger.info('mapped ', submittedFIName, ' to id: ', id.value);
                entityIds = id.value;
            } else {
                entityIds =   adminData.value.user.entityIds.map(function (a) {return a.entityId}).join(',');
            }
        }
    //}
    logger.info('entity type:  ', adminData.value.user.entityTypeId);
    logger.info('entity id(s):  ', entityIds);
    logger.info('service host: ', config.service_call_base_url.host);
    var postHeaders = {
        'Content-Type': 'application/json'
    };
    var options = {
        host: config.service_call_base_url.host, //'10.10.50.19',
        port: config.service_call_base_url.port,//'8080',
        path: "/qsupport/search/accountHolder", //TODO: .propertify
        headers: postHeaders,
        method: 'POST',
        data: '{"firstName":"' + req.param("fname") + '","lastName":"' + req.param("lname") + '","entityTypeId":"'
        + adminData.value.user.entityTypeId + '","entityIds":"' + entityIds + '","email":"' + req.param("email") + '","phone":"' + req.param("phone") + '"}'
    };
    var reqPost = http.request(options, function (wsResponse) {
        var loginResponse = "";
        wsResponse.on('data', function (d) {
            loginResponse += d;
        });
        wsResponse.on('end', function () {
            if (wsResponse.statusCode != 200) {
                logger.info("AH Search Service Response: ", wsResponse.statusCode);
                return cb('Unauthorized', null);
            }
            var results = {};
            results = JSON.parse(loginResponse);
            return cb(null, results);

        })
    });
    // write the json data
    reqPost.write(options.data);
    reqPost.end();
    reqPost.on('error', function (e) {
        return cb(e, null);
    });
}
