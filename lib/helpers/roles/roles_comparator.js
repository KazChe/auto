
module.exports = function(field, asc, primer){

    var key = primer ?
        function(x) {return primer(x[field]);} :
        function(x) {return x[field];};

    asc = [-1, 1][+!!asc];

    return function (a, b) {
        return a = key(a), b = key(b), asc * ((a > b) - (b > a));
    };
};
