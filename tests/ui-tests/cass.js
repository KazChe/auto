
var cass = require('cassandra-driver');
var client = new cass.Client({contactPoints: ['localhost'], keyspace: 'angelina'});

    client.execute("select admin from admin_session where id = 'kaz@quisk.co'", function(err, result) {
        if (!err){
            if ( result.rows.length > 0 ) {
                var user = result.rows[0];
                console.log('admin role retrieved: ', user.admin.role);
                process.exit();
            } else {
                console.log("No results");
            }
        }

        // Run next function in series
        //cb(err, null);
    })
