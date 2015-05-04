var express = require('express');
var app = module.exports = express();
var router = express.Router();
var ah_transaction_summary_service = require('../../services/search/ah_transaction_summary_service');
var tokenGenerator = require('../../middleware/token/tokenGenerator');
var couchbaseBucket = require('../../helpers/couchbase/dbbucket')();
var logger = require("../../config/logger/logger");
var AccountHolderUtil = require("../../helpers/account-holder/AccountHolderUtil");
var module_name = ' <accountHolderTransactionSummary> ';

router.post('/ap/support/ah/detail/transaction-summary', function(req, res, next) {
    logger.info('Entered', module_name)
    couchbaseBucket.get(req.user, function(err, resp) {
        if (err) {
            res.status('500');
            logger.error('Couchbase error: ', err, 'response: ', resp);
            return;
        } else {
            tokenGenerator(resp, function(err, token) {
                ah_transaction_summary_service(req, res, function (err, result){
                    if (err) {
                        logger.error('Error from calling ah_transaction_summary_service: ', err);
                        res.header('token', token);
                        res.status(err.status).set(err.message);
                    } else {
                        var serviceResponse = JSON.parse(result);
                        //logger.info('Success calling ah_transaction_summary_service: ', serviceResponse);
                        res.header('token', token);
                        res.render('support/ah-transaction/ah_transaction_summary_result', {
                           "selectedMonth": req.body.month,
                            "title" : 'AH Transaction Summary',
                            "ah_transactions" : serviceResponse,
                        });
                    }
                });
            });
        }
    });
});

module.exports = router;