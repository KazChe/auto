var express = require('express');
var app = module.exports = express();
var router = express.Router();
var bodyParser = require('body-parser');
var cons = require('consolidate');
var dust = require('dustjs-linkedin');
var ah_reset_pin_service = require('../../services/search/account-holder/ah_reset_pin_service');
var tokenGenerator = require('../../middleware/token/tokenGenerator');
var couchbaseBucket = require('../../helpers/couchbase/dbbucket')();
var logger = require("../../config/logger/logger");

router.post('/ap/support/ah/pin/reset', function(req, res, next) {
    couchbaseBucket.get(req.user, function(err, resp) {
        logger.info('err: ', err, 'response: ', resp);
        if (err) {
            res.status('500');
            return;
        } else {
            tokenGenerator(resp, function(err, token) {
                ah_reset_pin_service(req, res, function (err, result){
                    if (err) {
                        logger.error('Error from calling Reset PIN Service: ', err);
                        res.status('400').set('Bad Request');
                        res.header('token', token);
                        res.json(err);
                    } else {
                        logger.info('Success calling Reset PIN Service: ', result);
                        res.header('token', token);
                        res.json(result);
                    }
                });
            });
        }
    });
});

module.exports = router;