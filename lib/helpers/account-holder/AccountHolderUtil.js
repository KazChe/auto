var accountHolderUtil = exports;

accountHolderUtil.buildMonths = function() {

    var dropdown = {};
    var d = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var _counter = d.getMonth();
    var arrayTail = monthNames.splice(0, _counter+1);
    var dropdownArray = [];

    monthNames.push.apply(monthNames, arrayTail);
    for(var i = monthNames.length- 1, j =0; i >= 0; i-- , j++) {
        dropdownArray.push(monthNames[i])
    }

    dropdown["months"] = dropdownArray;

    return dropdown;
}