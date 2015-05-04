
var async = require('async');

module.exports = function(loginResponseJSON) {

    var adminTypeMappingToSearchCard = [];
    var mappings = {};
    async.each(loginResponseJSON.user.accessType, function (accessType, callback) {
        console.log('Processing adminType: ' + accessType);
        mappings = require('../../../config/' + accessType);
        for (var i = 0; i < mappings.length; i++) { //TODO: refactor this loop into an async
            adminTypeMappingToSearchCard.push(mappings[i].searchItem);
        }
        callback();
    }, function (err) {
        if (err) {
            console.log('A file failed to process');
        } else {
            console.log('AccessTtpes have been processed successfully');
            //console.log(adminTypeMappingToSearchCard);
        }
    });
    var defaultSearcMapping = require('../../../config/DEFAULT_ADMIN_SEARCH');
    adminTypeMappingToSearchCard.push(defaultSearcMapping[0].searchItem);
    loginResponseJSON.searchCard = adminTypeMappingToSearchCard;

    return loginResponseJSON;
}
