var express = require('express');
var app = module.exports = express();
var router = express.Router();
var bodyParser = require('body-parser');
var cons = require('consolidate');
var dust = require('dustjs-linkedin');
var login_service = require('../../services/login/login_service');
var ah_search_service = require('../../services/search/ah_search_service');
var get_fi_by_type_id = require('../../services/search/get_fi_by_type_id');
var resolve = require('path').resolve;
var couchbaseBucket = require('../../helpers/couchbase/dbbucket')();
var ahSearchValidator = require('../../helpers/validation/account_holder_search');
var logger = require("../../config/logger/logger");

router.get('/ap/support/search/ah', function (req, res, next) {
    couchbaseBucket.get(req.user, function (err, resp) {
        var fidropdownValues = resp.value.user.entityIds;
        var entityTypeId = resp.value.user.entityTypeId;
        var networkname = resp.value.user.entityIds.entityName;
        var networkDropDownValues = [];
        if (entityTypeId == 0) {
            get_fi_by_type_id(req, res, resp, function (err, filist) {
                if (err) {
                    logger.info('Error from calling get_fi_by_type_id: ', err);
                    req.msg = err;
                    return next('error');
                } else {
                    //logger.info('fi list of Quisk Admin', filist);
                    networkDropDownValues = filist;
                    if (networkDropDownValues.length > 1) {
                        networkDropDownValues.unshift({"entityName": "All Networks", "entityId": ""});
                    }
                    fidropdownValues = [{"entityName": "All Financial Institutions", "entityId": ""}, ''];
                    res.header('title', 'AH Search');
                    res.render('support/ahsearch',
                        {
                            pagetitle: 'AH Search',
                            menuitems: resp.value.user.roles,
                            username: {name: resp.value.user.firstName + ' ' + resp.value.user.lastName},
                            fidropdown: fidropdownValues,
                            networkadmin: networkDropDownValues //networkname
                        });
                }
            });
        }
        if (entityTypeId == 5) {
            get_fi_by_type_id(req, res, resp, function (err, filist) {
                if (err) {
                    logger.info('Error from calling get_fi_by_type_id: ', err);
                    req.msg = err;
                    return next('error');
                } else {
                    logger.info('fi list of Network Admin', filist);
                    fidropdownValues = filist;
                    // save into user profile

                    // end
                    if (fidropdownValues.length > 1) {
                        fidropdownValues.unshift({"entityName": "All Financial Institutions", "entityId": ""});
                    }
                    networkDropDownValues = networkname;
                    res.render('support/ahsearch',
                        {
                            pagetitle: 'AH Search',
                            menuitems: resp.value.user.roles,
                            username: {name: resp.value.user.firstName + ' ' + resp.value.user.lastName},
                            fidropdown: fidropdownValues,
                            networkadmin: networkDropDownValues
                        });
                }
            });
        }
        if (entityTypeId == 1) {
            logger.info('FI IDs: ', fidropdownValues);
            if (fidropdownValues.length > 1) {
                fidropdownValues.unshift({"entityName": "All Financial Institutions", "entityId": ""});
            }
            var networkIdsPlaceHolder = []; //TODO: rename
            logger.info('FI Drop Down Values: ', fidropdownValues);
            res.render('support/ahsearch',
                {
                    pagetitle: 'AH Search',
                    menuitems: resp.value.user.roles,
                    username: {name: resp.value.user.firstName + ' ' + resp.value.user.lastName},
                    fidropdown: fidropdownValues,
                    networkadmin: networkDropDownValues
                });
        }
    });
});

router.post('/ap/support/search/ah', function (req, res, next) {
    if (req.msg) {
        next(err);
        return;
    }
    ahSearchValidator.validateEmail(req.body.email);
    ahSearchValidator.validatePhone(req.body.phone);
    ahSearchValidator.validateFLname(req.body.lname, 'lname');
    ahSearchValidator.validateFLname(req.body.fname, 'fname');

    var validationResults = ahSearchValidator.getResult();
    if (Object.keys(validationResults).length > 0) {
        res.status('400');
        res.json(validationResults);
        return;
    }
    couchbaseBucket.get(req.user, function (err, resp) {
        if (err) {
            logger.error('Error fetching admin info from Couchbase: ', err)
            res.status('500');
            res.json(validationResults) //TODO: read from properties file
            return;
        } else {
            ah_search_service(req, res, resp, function (err, data) {
                if (err) {
                    logger.info('Error from calling account holder search service: ', err);
                    res.status('400');
                    res.json({error: 'Bad Request :)'})
                } else {
                    if (data.length > 0) {
                        res.header('title', 'AH Search');
                        res.render('support/ahsearch_result',
                            {
                                search_results: data
                            });
                    } else {
                        res.header('title', 'AH Search');
                        res.json('support/ahsearch_no_data',
                            {
                                nodata: {"nodata": "No Data Available"}
                            });
                    }
                }
            });
        }
    });
});

module.exports = router;
