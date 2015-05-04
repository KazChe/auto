var express = require('express');
var app = module.exports = express();
var router = express.Router();
var ah_transaction_detail_service = require('../../services/search/ah_transaction_detail_service');
var tokenGenerator = require('../../middleware/token/tokenGenerator');
var couchbaseBucket = require('../../helpers/couchbase/dbbucket')();
var logger = require("../../config/logger/logger");
var AccountHolderUtil = require("../../helpers/account-holder/AccountHolderUtil");
var module_name = ' <accountHolderTransactionDetail> ';

router.post('/ap/support/ah/detail/transaction-detail', function(req, res, next) {
    logger.info('Entered', module_name)
    logger.info('Account holder name: ',req.body.ahName);
    couchbaseBucket.get(req.user, function(err, resp) {
        if (err) {
            res.status('500');
            logger.error('Couchbase error: ', err, 'response: ', resp);
            return;
        } else {
            tokenGenerator(resp, function(err, token) {
                ah_transaction_detail_service(req, res, function (err, result){
                    if (err) {
                        logger.error('Error from calling ah transaction detail service:', err);
                        res.header('token', token);
                        res.status(err.status).set(err.message);
                        next();
                    } else {
                        var serviceResponse = JSON.parse(result)
                        logger.info('Success calling ah_transaction_detail_service: ', serviceResponse);
                        res.header('token', token);
                        res.render('support/ah-transaction/ah_transaction_detail_result', {
                            "selectedMonth": req.body.month,
                            "title" : 'AH Transaction Detail',
                            "ah_transaction_detail" : serviceResponse,
                            "ah_fName_lName": req.body.ahName
                        });
                    }
                });
            });
        }
    });
});
module.exports = router;