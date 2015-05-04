var couchbase = require('couchbase');
var conn      = new couchbase.Cluster('10.10.50.19:8091');

module.exports = function() {
    var bucket = conn.openBucket('merchant');
    bucket.operationTimeout = 120 * 1000
    return bucket;
    //var bucket = conn.openBucket('merchant');
    ////return bucket;
    //var N1qlQuery = couchbase.N1qlQuery;
    //var query = N1qlQuery.fromString('SELECT META(merchant) AS meta FROM merchant');
    //bucket.query(query, function(err, res) {
    //    if (err) {
    //        console.log('query failed', err);
    //        return bucket;
    //    }
    //    console.log('success!', res)
    //    return bucket;
    //});
}


