$(document).ajaxComplete(function(event, xhr, settings) {
    if(settings.url.indexOf('/ap/') == 0) {
        localStorage.setItem('quiskt', xhr.getResponseHeader('token'));
    }
});
