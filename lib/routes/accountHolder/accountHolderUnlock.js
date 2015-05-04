var express = require('express');
var app = module.exports = express();
var router = express.Router();
var bodyParser = require('body-parser');
var cons = require('consolidate');
var dust = require('dustjs-linkedin');
var ah_unlock_service = require('../../services/search/account-holder/ah_unlock_service');
var tokenGenerator = require('../../middleware/token/tokenGenerator');
var couchbaseBucket = require('../../helpers/couchbase/dbbucket')();
var logger = require("../../config/logger/logger");

router.post('/ap/support/ah/unlock', function(req, res, next) {
    couchbaseBucket.get(req.user, function(err, resp) {
        logger.info('err: ', err, 'response: ', resp);
        if (err) {
            res.status('500');
            return;
        } else {
            tokenGenerator(resp, function(err, token) {
                ah_unlock_service(req, res, function (err, result){
                    if (err) {
                        logger.error('Error from calling Unlock Service: ', err);
                        res.status('400').set('Bad Request');
                        res.header('token', token);
                        // TODO: detect http response and send 200 or otherwise
                        res.json({error:err});
                    } else {
                        logger.info('Success calling Unlock Service: ', result);
                        res.header('token', token);
                        // TODO: detect http response and send 200 or otherwise
                        res.json(result);
                    }
                });
            });
        }
    });
});

module.exports = router;