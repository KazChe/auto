var async = require('async');

async.each(['FI_NETWORK_ADMIN', 'FI_ISSUER_ADMIN', 'FI_ACQUIRER_ADMIN'], function (file, callback) {
    console.log('Processing file ' + file);
    console.log('File processed');
    callback();
}, function (err) {
    if (err) {
        console.log('A file failed to process');
    } else {
        console.log('All files have been processed successfully');
    }
});
