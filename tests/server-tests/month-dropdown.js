var dropdown = {};
var d = new Date();
var monthsDropDown = {};

var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];



var _counter = d.getMonth();
var arrayTail = monthNames.splice(0, _counter+1);
monthNames.push.apply(monthNames, arrayTail);
var dropdownArray = [];
for(var i = monthNames.length- 1, j =0; i >= 0; i-- , j++) {
    //console.log(monthsJSON[monthNames[i]] ,' ',monthNames[i])
    //console.log(i,':',monthNames[i])
    dropdownArray.push(monthNames[i])
}


dropdown["months"] = dropdownArray;
console.log(dropdown)


//var dropdown = {};
//var d = new Date();
//var monthsDropDown = {};
//
//var monthNames = ["January", "February", "March", "April", "May", "June",
//    "July", "August", "September", "October", "November", "December"
//];
//
var monthsJSON = {
    '0': 'January',
    '1': 'February',
    '2': 'March',
    '3': 'April',
    '4': 'May',
    '5': 'June',
    '6': 'July',
    '7': 'August',
    '8': 'September',
    '9': 'October',
    '10': 'November',
    '11': 'December'
}
//var monthsJSON = {
//    'January': '0',
//    'February': '1',
//    'March': '2',
//    'April': '3',
//    'May': '4',
//    'June': '5',
//    'July': '6',
//    'August': '7',
//    'September': '8',
//    'October': '9',
//    'November': '10',
//    'December': '11'
//}
//var _counter = d.getMonth();
//var arrayTail = monthNames.splice(0, _counter+1);
//monthNames.push.apply(monthNames, arrayTail);
//var dropdownArray = [];
//for(var i = monthNames.length- 1, j =0; i >= 0; i-- , j++) {
//    //console.log(monthsJSON[monthNames[i]] ,' ',monthNames[i])
//    //console.log(i,':',monthNames[i])
//    dropdownArray.push(monthNames[i])
//}
//console.log(dropdownArray)