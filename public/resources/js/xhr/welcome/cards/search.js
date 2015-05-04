//
//// TODO refactor if other searches can re-use this - read from e object
$(document).ready(function(){
    //$('#main').on('click contextmenu', '#ah-search', function (e) {
    $('#main').on('click', '#ah-search', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/ap/support/search/ah',
            type: "get",
            //headers: {token: sessionStorage.getItem('quiskt')},
            headers: {token: localStorage.getItem('quiskt')},
            success: function (data, textStatus, request) {
                document.title = request.getResponseHeader('title');
                $('.row').html(data);
        },
            error: function (data, textStatus, request) {
                $('.row').html(data);
            }
        });
    })
})
