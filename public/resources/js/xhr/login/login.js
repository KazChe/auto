$(document).ready(function () {
    $('#login').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/ap/welcome',
            type: "post",
            data: {"email": $('#email').val(), "password": $('#password').val()},
            success: function (data, textStatus, request) {
                localStorage.setItem('quiskt', request.getResponseHeader('token'));
                $('#main').html(data);
                document.title = request.getResponseHeader('title');
            },
            error: function (data, textStatus, request) {
                data.getAllResponseHeaders();
            }
        });

        $('#main').on('keydown', $('input[class="form-control input-lg"]'), function() {
            $('#login-msg').remove();
        });
    });


    //TODO: Logout  - refcator into commonjs module
    $('#main').on('click', '#logout', function(){
        localStorage.removeItem('quiskt');
        localStorage.removeItem('DataTables_search-result_/ap/support/search/ah');
        sessionStorage.removeItem('qup');
    });

    //TODO: Home - refcator into commonjs module
    $('#main').on('click', '#home', function(e){
        e.preventDefault();
        $.ajax({
            url: '/ap/home',
            type: "get",
            headers: {token: sessionStorage.getItem('quiskt')},
            success: function (data, textStatus, request) {
                localStorage.setItem('quiskt', request.getResponseHeader('token'));
                $('#main').html(data);
            },
            error: function (data, textStatus, request) {
                data.getAllResponseHeaders();
            }
        });
    });
});
