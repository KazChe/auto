var sort_by = function(field, asc, primer){

    var key = primer ?
        function(x) {return primer(x[field]);} :
        function(x) {return x[field];};

    asc = [-1, 1][+!!asc];

    return function (a, b) {
        return a = key(a), b = key(b), asc * ((a > b) - (b > a));
    };
};

function sortByKey(arr,key,direction) {
    function sortNumeric(a,b) {
        if (direction=="ASC") {
            return a[key]-b[key];
        } else {
            return b[key]-a[key];
        }
    }
    return arr.sort(sortNumeric);
}

var roles =        [
    {
        "roleId": "ONBOARDING_MENU",
        "roleName": "Onboarding"
    },
    {
        "roleId": "REPORT_MENU",
        "roleName": "Report"
    },
    {
        "roleId": "ADMIN_MENU",
        "roleName": "Admin"
    }
];


var sortedrolesASC = roles.sort(sort_by('roleName', true, function(a){return a;}));
console.log('roles ',sortedrolesASC,'\n');

var sortedrolesDESC = roles.sort(sort_by('roleName', false, function(a){return a;}));
console.log('roles ',sortedrolesDESC);

