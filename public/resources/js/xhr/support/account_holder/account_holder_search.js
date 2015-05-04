$(document).ready(function () {
    $('#main').on('click', '#search-btn', function (e) {
        e.preventDefault();
        localStorage.removeItem('DataTables_search-result_/ap/support/search/ah');
        $.ajax({
            url: '/ap/support/search/ah',
            type: "post",
            headers: {token: sessionStorage.getItem('quiskt')},
            data: {
                'phone': $('#mobile').val(),
                'email': $('#email').val(),
                'fname': $('#fname').val(),
                'lname': $('#lname').val(),
                'fiName': $('#dropdownMenu1').text() || $('#entityName').text(),
                'networkName': $('#network-list').text()
            },
            success: function (data, textStatus, request) {
                if(!request.getResponseHeader('token')) {
                    $('.row').remove();
                    $('#main').html(data);
                    return;
                }
                document.title = request.getResponseHeader('title');
                $('.container-fluid').html(data);
                $('#search-result').dataTable({
                    responsive: true,
                    stateSave: true,
                    "stateLoadCallback": function (settings) {
                        var currentState;
                        currentState = JSON.parse(localStorage.getItem('DataTables_search-result_/ap/support/search/ah'));
                        return currentState;
                    },
                    "oLanguage": {
                        "sSearch": "Filter records:"
                    }
                });
            },
            error: function (data, textStatus, request) {
                if (data.status == 500) {
                    $('#msg-row').html('<div class="col-sm-2" id="empty-search" style="text-align: center;"></div><div class="col-md-3 alert alert-danger" style="text-align: center;">' + data.statusText + '</div>');
                } else {
                    $('#msg-row').html('<div class="col-sm-2" id="empty-search" style="text-align: center;"></div><div class="col-sm-3 alert alert-danger" style="text-align: center;"></div>');
                    for (var i = 0; i < data.responseJSON.length; i++) {
                        $('.col-sm-3.alert.alert-danger').append('<span>' + data.responseJSON[i] + '</span><br>');
                    }
                }
            }
        });
    })
    $('#main').on('keydown', $('form[class="form-horizontal ah-search"]'), function () {
        $('#msg-row').html('');
    });

    $('#main').on('click', $("#fi-dropdown"), function (e) {
        if ((e.target.text || e.target.textContent) && (e.target.attributes[0].value == 'fidropdown' || e.target.dataset.role == 'fidropdown')) {
            $('#dropdownMenu1').html(e.target.text + ' <span class="caret"></span>')
        }
    })

    if($('#network-list')) {
        $('#main').on('click', $("#search_result"), function (e) {
            var selectedNetwork = e.target.text || e.target.textContent;
            if(selectedNetwork && (e.target.attributes[0].value == 'network' || e.target.dataset.role == 'network')) {
                $('#network-list').html(selectedNetwork + ' <span class="caret"></span>')
                if(selectedNetwork != "All Networks") {
                    $.ajax({
                        url: '/ap/support/fibynetwork',
                        type: "post",
                        headers: {token: sessionStorage.getItem('quiskt')},
                        data: {
                            'networkName': $('#network-list').text()
                        },
                        success: function (data, textStatus, request) {
                            document.title = request.getResponseHeader('title');
                            $('.temp').remove();
                            dust.render('fibynetwork.js', data, function(err, out) {
                                if(err){
                                    console.log(err)
                                } else {
                                    if(out.length > 0) {
                                        $('#dropdownMenu1').html('All Financial Institutions'+ ' <span class="caret"></span>')
                                        $("#fi-ul").append(out);
                                    }
                                }
                            });
                        },
                        error: function (data, textStatus, request) {
                            if (data.status == 500) {
                                $('#msg-row').html('<div class="col-sm-2" id="empty-search" style="text-align: center;"></div><div class="col-md-3 alert alert-danger" style="text-align: center;">' + data.statusText + '</div>');
                            } else {
                                $('#msg-row').html('<div class="col-sm-2" id="empty-search" style="text-align: center;"></div><div class="col-sm-3 alert alert-danger" style="text-align: center;"></div>');
                                for (var i = 0; i < data.responseJSON.length; i++) {
                                    $('.col-sm-3.alert.alert-danger').append('<span>' + data.responseJSON[i] + '</span><br>');
                                }
                            }
                        }
                    });

                } else if(selectedNetwork == "All Networks") {
                    $('#dropdownMenu1').html('All Financial Institutions'+ ' <span class="caret"></span>')
                    if($('.temp')) {$('.temp').remove();}
                }
            }

        });
    }
});
