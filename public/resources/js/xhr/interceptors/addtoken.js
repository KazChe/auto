$.ajaxSetup( {
        beforeSend: function(xhr, settings) {
            if(settings.url.indexOf('/ap/') == 0) {
                window.history.pushState(settings.type, "", settings.url);
                xhr.setRequestHeader('token', localStorage.getItem('quiskt'));
            }
        }
    }
);
