var socket = io.connect('http://localhost:3000', {
    'query': 'token=eyJhbGciOiJIUzI1NiJ9.Sk9ET0tUaHUgSmFuIDA4IDIwMTUgMTM6NDc6MTQgR01ULTA4MDAgKFBhY2lmaWMgU3RhbmRhcmQgVGltZSk.PQFW2o7PrwnmMe7Gx6PHAa6bu23tpk1VBFFI30Gmfgo'
});
// listen for server (port 8111) connection
socket.on('connect', function (id) {
    $('#status').text('Connected to 8111');
    // TODO: Checks will/should be put in place to validate reqreuied data is present.
    // need to think about handling (socket) server crash/disconnect (see reason document.ready() in index.html
    //socket.emit('message', 'I am client and need your report.html page (on conn) ');
});

socket.on('error', function(e) {
    console.log('Error: ', e);
    $('#status').text(">> " + e);
})
// i'm known to server 1 as
socket.on('setID', function (myID) {
    console.log('receive id: ' + myID)
    $('#IDReceivedMessage').text(myID)
});

socket.on('message', function (m) {
    $('#message').text("> " + m);
});

socket.on('reportSent', function (m) {
    var source = $("#entry-template").html();
    var compiled = dust.compile(source, "app-a");
    dust.loadSource(compiled);
    dust.render("app-a", m, function (err, out) {
        $("#app-a-output").html(out);
    });
});

// I get notified when my server 1 disconnects/crashes
socket.on('disconnect', function () {
    $('#status').text('Disconnected');
});

socket.on('customEvent', function (message) {
    $('#customEvent').text(">> " + message['time']);
});
