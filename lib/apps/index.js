var express = require('express');
var app = module.exports = express();
var router = express.Router();
var bodyParser = require('body-parser');
var cons = require('consolidate');
var dust = require('dustjs-linkedin');
var login_service = require('../services/login/login_service');
var ah_search_service = require('../services/search/ah_search_service');
var get_fi_by_type_id = require('../services/search/get_fi_by_type_id');
var tokenGenerator = require('../middleware/token/tokenGenerator');
var resolve = require('path').resolve;
var couchbaseBucket = require('../helpers/couchbase/dbbucket')();
var props = require('properties-parser').read('./lib/config/messages/messages.properties');
var async = require('async');
var ahSearchValidator = require('../helpers/validation/account_holder_search');
var roleCompartor = require('../helpers/roles/roles_comparator');
var logger = require("../config/logger/logger");
var jsonQuery = require('json-query');

var ahsearch = require('../routes/accountHolder/accountHolderSearch');
var ahSummaryProfileSearch = require('../routes/accountHolder/accountHolderSummaryProfileSearch');
var ahTransactionSummary = require('../routes/accountHolder/accountHolderTransactionSummary');
var ahTransactionDetail = require('../routes/accountHolder/accountHolderTransactionDetail');
var accountHolderResetPIN = require('../routes/accountHolder/accountHolderResetPIN');
var accountHolderUnlock = require('../routes/accountHolder/accountHolderUnlock');
var terminateAccountHolder = require('../routes/accountHolder/terminateAccountHolder');


logger.debug("Overriding 'Express' logger");
app.use(require('morgan')("default", {"stream": logger.stream}));

app.engine('dust.html', cons.dust);
app.set('view engine', 'dust.html')
app.set('views', [__dirname + '/views'])//, dustTemplates]);
logger.info('views:: ', app.get('views'))

app.use(express.static(__dirname + '/public', {redirect: false}));
app.use(express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
app.use(router);

app.use(ahsearch);
app.use(ahSummaryProfileSearch);
app.use(ahTransactionSummary);
app.use(ahTransactionDetail);
app.use(accountHolderResetPIN);
app.use(accountHolderUnlock);
app.use(terminateAccountHolder);

router.get('/login', function (req, res, next) { //TODO: can we do something useful with this middleware?
    //logger.info('route middleware invoked');
    next();
});

function handleLoginPageRedirect(req, res) {
    var msg = req.msg;
    res.render('login/index', {msg: res.msg});

}

app.route('/ap/adminportal')
    .get(function (req, res) {
        res.render('login/index', {msg: res.msg, pagetitle: 'Login'});
    });

app.route('/ap/logout')
    .get(function (req, res) {
        //TODO:  remove coucbhase entry if session still valid
        res.render('login/index', {msg: res.msg});
    });

app.route('/ap/support/fibynetwork')
    .post(function(req, res, next){
        logger.info('Retrieving FI list for Network:', req.param('networkName'))
        // extract network name sent/selected
        couchbaseBucket.get(req.user, function (err, resp) {
            // call entitysearch service:
            get_fi_by_type_id(req, res, resp, function (err, filist) {
                if (err) {
                    logger.info('Error from calling get_fi_by_type_id: ', err);
                    req.msg = err;
                    return next('error');
                } else {
                    var fidropdownValues= {};
                    fidropdownValues.filist = filist;
                    res.header('title', 'AH Search');
                    res.json(fidropdownValues);
                }
            });
            // hint: entityTypeId is 5(FI_Network), expectedEntityTypeId is 1(FI), entityId is fiNetworkId.
        });
    });

app.route('/ap/support/search/ah', ahsearch);
app.route('/ap/support/ah/detail', ahSummaryProfileSearch);
app.route('/ap/support/ah/detail/transaction-summary', ahTransactionSummary);
app.route('/ap/support/ah/pin/reset', accountHolderResetPIN);
app.route('/ap/support/ah/unlock', accountHolderUnlock);

app.route('/ap/support/ah/detail/linkedaccounts').post(function (req, res, next) {
    couchbaseBucket.get(req.user, function (err, resp) {
        //logger.info('err: ', err, 'response: ', resp);
        tokenGenerator(resp, function (err, token) {
            res.header('token', token);
            res.send({
                title: 'AH Detail Summary',
                mock: {'data':'Server says you clicked: '+req.body.menuclicked},
            });
        });
    });
});


//// TODO: require a middleware to place user object, token and jwtc into req
app.route('/ap/home')
    .get(function (req, res) {
        //req.get
        couchbaseBucket.get(req.user, function (err, resp) {
            //logger.info('err: ', err, 'response: ', resp);
            tokenGenerator(resp, function (err, token) {
                res.header('token', token)
                res.render('welcome/index', {
                    title: 'AP - Welcome',
                    menuitems: resp.value.user.roles.sort(),
                    annoucements: 'no content in new dir',
                    search: resp.value.searchCard,
                    workqueue: 'no content in new dir',
                    username: {name: resp.value.user.firstName + ' ' + resp.value.user.lastName},
                    token: token
                });
            });
        });
    });

app.route('/ap/welcome')
    .post(function (req, res, next) {
        //TODO: wrap all these calls into an asyncjs control flow (waterfall?)
        login_service(req, res, function (err, data) {
            if (err) {
                logger.error('Error from calling loginService: ', err);
                req.msg = err;
                return next('error');
            } else {
                tokenGenerator(data, function (err, token) {
                    if (err) {
                        res.send('token generation failed'); //TODO: send to error middleware(TBC)
                    } else {
                        res.header('token', token)
                        res.header('title', 'Welcome')
                        res.render('welcome/index', {
                            menuitems: data.user.roles.sort(roleCompartor('roleName', true, function (a) {
                                return a;
                            })),
                            username: {name: data.user.firstName + ' ' + data.user.lastName},
                            search: data.searchCard,
                            token: token,
                        });
                    }
                });
            }
        })
    });

app.use(function (err, req, res, next) {
    if (!req.statusCode) {
        if (req.msg) {
            if (req.msg.code == 'ETIMEDOUT')
                req.msg = 'Service Unavailable';
        }
    }
    logger.error('(index.js)' , err);
    var erroMsg = props[req.msg] || req.msg;
    res.render('login/index', {msg: erroMsg});
});

//app.use(function(req, res, next) {
//    res.render('login/', {
//        msg: req.msg
//    });
//});


//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 401);
//    res.render('login/index', {
//        message: err.message,
//        error: {}
//    });
//});

//app.use(function(err, req, res, next){
//    console.error(err.stack);
//    res.render('401');
//});
