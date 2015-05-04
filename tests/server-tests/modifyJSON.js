var foo = {
    "transactionHistory":[
        {
            "transactionType":"CREDIT",
            "transactionAmount":{
                "amount":0.10,
                "currency":"USD"
            },
            "transactionDescription":"Add Money from linked account",
            "transactionTime":3,
            "transactionId":677685,
            "rrn":222,
            "timeZoneDesc":null,
            "months": ["Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sep", "Oct", "Nov", "Dec"],

            "trxDate": function(chunk,  context, bodies, params) {
                return this.months[this.transactionTime]
            }
        },
        {
            "transactionType":"CREDIT",
            "transactionAmount":{
                "amount":15.18,
                "currency":"USD"
            },
            "transactionDescription":"Add Money from linked account",
            "transactionTime":null,
            "transactionId":1241242142142142214,
            "rrn":null,
            "timeZoneDesc":null
        },
        {
            "transactionType":"CREDIT",
            "transactionAmount":{
                "amount":15.18,
                "currency":"USD"
            },
            "transactionDescription":"Add Money from linked account",
            "transactionTime":null,
            "transactionId":1241242142142142212,
            "rrn":null,
            "timeZoneDesc":null
        },
        {
            "transactionType":"CREDIT",
            "transactionAmount":{
                "amount":10.01,
                "currency":"USD"
            },
            "transactionDescription":"Add Money from linked account",
            "transactionTime":null,
            "transactionId":156580,
            "rrn":null,
            "timeZoneDesc":null
        },
        {
            "transactionType":"CREDIT",
            "transactionAmount":{
                "amount":15.18,
                "currency":"USD"
            },
            "transactionDescription":"Add Money from linked account",
            "transactionTime":null,
            "transactionId":1241242142142142214,
            "rrn":null,
            "timeZoneDesc":null
        },
        {
            "transactionType":"CREDIT",
            "transactionAmount":{
                "amount":15.18,
                "currency":"USD"
            },
            "transactionDescription":"Add Money from linked account",
            "transactionTime":null,
            "transactionId":1241242142142142243,
            "rrn":null,
            "timeZoneDesc":null
        }
    ],
        "totalTransactionCounts":0
}

for(var i = 0; i < foo.transactionHistory.length; i++) {
    foo.transactionHistory[i]["months"] =  ["Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    foo.transactionHistory["trxDate"] =  function() {return this.months[this.transactionTime]}
}
console.log(foo.transactionHistory);