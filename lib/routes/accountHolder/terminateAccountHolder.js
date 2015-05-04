var express = require('express');
var app = module.exports = express();
var router = express.Router();
var bodyParser = require('body-parser');
var cons = require('consolidate');
var dust = require('dustjs-linkedin');
var ah_terminate_service = require('../../services/search/account-holder/ah_terminate_service');
var tokenGenerator = require('../../middleware/token/tokenGenerator');
var couchbaseBucket = require('../../helpers/couchbase/dbbucket')();
var logger = require("../../config/logger/logger");

router.post('/ap/support/ah/delete', function(req, res, next) {
    couchbaseBucket.get(req.user, function(err, resp) {
        logger.info('err: ', err, 'response: ', resp);
        if (err) {
            res.status('500');
            return;
        } else {
            tokenGenerator(resp, function(err, token) {
                ah_terminate_service(req, res, function (err, result){
                    if (err) {
                        logger.info('Error from calling Terminate Account Service: ', err);
                        res.status(err).set('Bad Request');
                        res.header('token', token);
                        // TODO: detect http response and send 200 or otherwise
                        res.json({result : 'rockandroll'});
                    } else {
                        logger.info('Success calling Terminate Service: ', result);
                        res.header('token', token);
                        // TODO: detect http response and send 200 or otherwise
                        res.json({result : {'status' : result.status}});
                    }
                });
            });
        }
    });
});

module.exports = router;