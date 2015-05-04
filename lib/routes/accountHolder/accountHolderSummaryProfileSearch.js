var express = require('express');
var app = module.exports = express();
var router = express.Router();
var bodyParser = require('body-parser');
var cons = require('consolidate');
var dust = require('dustjs-linkedin');
var ah_summary_profile_service = require('../../services/search/ah_summary_profile_service');
var tokenGenerator = require('../../middleware/token/tokenGenerator');
var couchbaseBucket = require('../../helpers/couchbase/dbbucket')();
var logger = require("../../config/logger/logger");
var module_name = '< accountHolderSummaryProfileSearch >';

router.post('/ap/support/ah/detail', function (req, res, next) {
    couchbaseBucket.get(req.user, function (err, resp) {
        if (err) {
            logger.error(module_name, 'err: ', err);
            res.status('500');
            return;
        } else {
            tokenGenerator(resp, function (err, token) {
                ah_summary_profile_service(req, res, function (err, result) {
                    if (err) {
                        logger.error('Error from calling ah_summary_profile_service: ', err.errorMessage);
                        res.status('400').set('Bad Request');
                        res.header('token', token);
                        res.json({error: err.errorMessage});
                    } else {
                        logger.info('Success calling ah_summary_profile_service: ', result);
                        res.header('token', token);
                        res.header('qup', JSON.stringify(result));
                        if (req.body.partial) {
                            logger.debug('Rendering partial summary profile');
                            res.render('support/ah-detail/partials/summary-profile', {
                                result: {
                                    'idType': result.idType,
                                    'idNumber': result.idNumber,
                                    'dob': result.dob,
                                    'accountCreationDate': result.accountCreationDate,
                                    'lastActivityDate': result.lastActivityDate,
                                    'balance': result.balance,
                                    'balanceLimit': result.balanceLimit,
                                    'status': result.status,
                                    'smsAccountLocked': result.smsAccountLocked,
                                    'smsAccountFreeze': result.smsAccountFreeze,
                                    'confirmFlag': result.confirmFlag,
                                    'cyesFlag': result.cyesFlag,
                                    'authLock': result.authLock
                                }
                            });
                        }
                        else {
                            res.render('support/ah-detail/main-ah-detail', {
                                title: 'AH Detail Summary',
                                result: {
                                    'overlayTitle': 'Summary Profile',
                                    'ahFirstName': req.body.ahFirstName,
                                    'ahLastName': req.body.ahLastName,
                                    'ahPhone': req.body.ahPhone,
                                    'fiName': req.body.fiName,
                                    'fiNetworkName': req.body.fiNetworkName,
                                    'fiId': req.body.fiId,
                                    'idType': result.idType,
                                    'idNumber': result.idNumber,
                                    'dob': result.dob,
                                    'accountCreationDate': result.accountCreationDate,
                                    'lastActivityDate': result.lastActivityDate,
                                    'balance': result.balance,
                                    'balanceLimit': result.balanceLimit,
                                    'status': result.status,
                                    'smsAccountLocked': result.smsAccountLocked,
                                    'smsAccountFreeze': result.smsAccountFreeze,
                                    'confirmFlag': result.confirmFlag,
                                    'cyesFlag': result.cyesFlag,
                                    'authLock': result.authLock

                                }
                            });
                        }
                    }
                });
            });
        }
    });
});

module.exports = router;