$(document).ready(function () {

    // on close of modal remove content
    $('body').on('hidden.bs.modal', '#tallModal', function () {
        $('.modal-body').html('')
    });

    $('body').on('click', function (e) {
        if (e.target.id == "reset-pin-yes") {
            e.preventDefault();
            var userProfileInSession = JSON.parse(window.sessionStorage.getItem('qup'))
            $.ajax({
                url: '/ap/support/ah/pin/reset',
                type: "post",
                headers: {token: localStorage.getItem('quiskt')},
                data: {'ahId': userProfileInSession.accountId},
                success: function (data, textStatus, request) {
                    userProfileInSession.status = 'PENDING';
                    sessionStorage.setItem('qup', JSON.stringify(userProfileInSession));
                    $('#account-status').text('PENDING');
                    $('#last-activity-date').text(setActivityDate());
                    $('#account-status').parent().attr('id', 'updatable');
                    $('#last-activity-date').parent().attr('id', 'updatable');
                    $("#" + userProfileInSession.accountId + "").text('PENDING');
                    $('#resetmodal').modal('hide');
                    $('#action-message').html('<div class="alert alert-success summary-alert alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>Reset PIN Successful</div>');

                },
                error: function (data, textStatus, request) {
                    $('#resetmodal').modal('hide');
                    $('#action-message').html('<div class="alert alert-danger summary-alert alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>' + JSON.parse(data.responseJSON).errorMessage + '</div>');
                }
            });
        }
        else if (e.target.id == "unlock-yes") {
            e.preventDefault();
            var userProfileInSession = JSON.parse(window.sessionStorage.getItem('qup'))
            $.ajax({
                url: '/ap/support/ah/unlock',
                type: "post",
                headers: {token: localStorage.getItem('quiskt')},
                data: {'ahId': userProfileInSession.accountId}, // TODO: add/send relevant data
                success: function (data, textStatus, request) {
                    userProfileInSession.authLock = 'N';
                    sessionStorage.setItem('qup', JSON.stringify(userProfileInSession));
                    $('#unlockmodal').modal('hide');
                    $('#account-lock').text('N');
                    $('#account-lock').parent().attr('id', 'updatable');
                    $('#unlock-div').remove();
                    $('#action-message').html('<div class="alert alert-success summary-alert alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>Unlock Successful</div>');

                },
                error: function (data, textStatus, request) {
                    $('#unlockmodal').modal('hide');
                    $('#action-message').html('<div class="alert alert-danger summary-alert alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>Unlock Account Failed</div>');

                }
            });
        }
        else if (e.target.id == "terminate-yes") {
            e.preventDefault();
            var userProfileInSession = JSON.parse(window.sessionStorage.getItem('qup'))
            $.ajax({
                url: '/ap/support/ah/delete',
                type: "post",
                headers: {token: localStorage.getItem('quiskt')},
                data: {'ahId': userProfileInSession.accountId},
                success: function (data, textStatus, request) {
                    userProfileInSession.status = 'DELETED';
                    sessionStorage.setItem('qup', JSON.stringify(userProfileInSession));
                    $('#account-status').text('DELETED');
                    $('#last-activity-date').text(setActivityDate());
                    $('#account-status').parent().attr('id', 'updatable');
                    $('#last-activity-date').parent().attr('id', 'updatable');
                    $("#" + userProfileInSession.accountId + "").text('DELETED');
                    $('#action-controls').remove();
                    $('#action-message').html('<div class="alert alert-success summary-alert alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>Account closed successfully</div>');
                    $('#terminatemodal').modal('hide');
                },
                error: function (data, textStatus, request) {
                    $('#terminatemodal').modal('hide');
                    $('#action-message').html('<div class="alert alert-danger summary-alert alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>Close Account Failed</div>');
                }
            });
        }
    });

        $('#main').on('click', 'tr', '#search-result tbody', function (e) {
        // Start TODO: Higlighting: why is not me working???
        $('#example tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#button').click(function () {
            table.row('.selected').remove().draw(false);
        });
        // END TODO: Higlighting: why is not me working???

        if ($(e.target).is('a')) {
            e.preventDefault();
            $('#msg-row').html('')
            var ahFirstName = $('td', this).eq(0).text();
            var ahLastName = $('td', this).eq(1).text();
            var accountId = $('td', this).eq(2).text();
            var ahPhone = $('td', this).eq(5).text();
            var fiName = $('td', this).eq(6).text();
            var fiNetworkName = $('td', this).eq(7).text();
            var fiId = $(this).find('input').val();
            //TODO: ? save this into session storage ?
            $.ajax({
                url: '/ap/support/ah/detail',
                type: "post",
                headers: {token: localStorage.getItem('quiskt')},
                data: {
                    'ahFirstName': ahFirstName,
                    'ahLastName': ahLastName,
                    'accountId': accountId,
                    'ahPhone': ahPhone,
                    'fiName': fiName,
                    'fiNetworkName': fiNetworkName,
                    'fiId': fiId
                },
                success: function (data, textStatus, request) {
                    if (!request.getResponseHeader('token')) {
                        $('.row').remove();
                        $('#main').html(data);
                        return;
                    }
                    document.title = 'Account Holder Summary Profile';
                    $('#tallModal').modal('show');
                    $('.modal-body').html('');
                    $('.modal-body').html(data);
                    var modQUP = JSON.parse(request.getResponseHeader('qup'));
                    modQUP.fiName = fiName;
                    modQUP.fiNetworkName = fiNetworkName;
                    sessionStorage.setItem('qup', JSON.stringify(modQUP));
                },
                error: function (data, textStatus, request) {
                    if (data.status != 200) {
                        $('#msg-row').html('<div id="service-err" class="col-sm-2" id="empty-search" style="text-align: center;"></div><div class="col-md-3 alert alert-danger" style="text-align: center;">' + data.responseJSON.error + '</div>');
                    } else {
                        $('#msg-row').html('<div class="col-sm-2" id="empty-search" style="text-align: center;"></div><div class="col-sm-3 alert alert-danger" style="text-align: center;"></div>');
                        for (var i = 0; i < data.responseJSON.length; i++) {
                            $('.col-sm-3.alert.alert-danger').append('<span>' + data.responseJSON[i] + '</span><br>');
                        }
                    }
                }
            });

        }
    });

    var latestMonth;
    $('#main').on('click', '.form-control.transaction-summary-month', function (e) {
        latestMonth = e.target.value;
    });

        $('#main').on('click', '#transaction-summary', function (e) {
        var userProfileInSession = JSON.parse(sessionStorage.getItem('qup'));
        if ($(e.target).is('a')) {
            $.ajax({
                url: '/ap/support/ah/detail/transaction-summary',
                type: "post",
                headers: {token: sessionStorage.getItem('quiskt')},
                data: {'ahId': userProfileInSession.accountId, 'fiId': userProfileInSession.fiId, 'month': $('.form-control.transaction-summary-month').val() || 0},
                success: function (data, textStatus, request) {
                    if (!request.getResponseHeader('token')) {
                        $('.row').remove();
                        $('#main').html(data);
                        return;
                    }
                    document.title = getOverlayTitle(e.target.id);
                    $('.panel-body.summary-right').html(data);
                    constructDropDown();
                    $('#overlay-title').html(getOverlayTitle(e.target.id));
                    $(".list-group.summary-left a").removeClass('active');
                    $('#' + e.target.id).addClass('active');
                    // dataTable initialization
                    $('#transaction-result').dataTable({
                        "responsive": true,
                        "order": [[0, "desc"]],
                        "scrollY": "200px",
                        "scrollCollapse": true,
                        "oLanguage": {
                            "sSearch": "Filter records:",
                            "sEmptyTable": "No transactions available for "+$('.form-control.transaction-summary-month option:selected').text()
                        },
                        "columnDefs": [
                            { "width": "15%", "targets": 0 }
                        ]

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
        }
    });

    //TODO: must refactor this (and the one above)!!!!
    $('#main').on('click', '#summary-transaction-activity-btn', function (e) {
        var userProfileInSession = JSON.parse(sessionStorage.getItem('qup'));
            $.ajax({
                url: '/ap/support/ah/detail/transaction-summary',
                type: "post",
                headers: {token: sessionStorage.getItem('quiskt')},
                data: {'ahId': userProfileInSession.accountId, 'fiId': userProfileInSession.fiId, 'month': $('.form-control.transaction-summary-month').val() || 0},
                success: function (data, textStatus, request) {
                    if (!request.getResponseHeader('token')) {
                        $('.row').remove();
                        $('#main').html(data);
                        return;
                    }
                    $('.panel-body.summary-right').html(data);
                    constructDropDown(latestMonth);
                    // dataTable initialization
                    $('#transaction-result').dataTable({
                        "responsive": true,
                        "order": [[0, "desc"]],
                        "scrollY": "200px",
                        "scrollCollapse": true,
                        "oLanguage": {
                            "sSearch": "Filter records:",
                            "sEmptyTable": "No transactions available for "+$('.form-control.transaction-summary-month option:selected').text()
                        },
                        "columnDefs": [
                            { "width": "15%", "targets": 0 }
                        ]
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
    });

    // Click on summary profile
    $('#main').on('click', '#profile-summary', function (e) {
            var userProfileInSession = JSON.parse(sessionStorage.getItem('qup'));
            e.preventDefault();
            var ahFirstName = userProfileInSession.firstName;
            var ahLastName = userProfileInSession.lastName;
            var accountId = userProfileInSession.accountId;
            var ahPhone = userProfileInSession.phoneNumber;
            var fiName = userProfileInSession.fiName;
            var fiNetworkName = userProfileInSession.fiNetworkName;
            var fiId = userProfileInSession.fiId;
            //TODO: ? save this into session storage ?
            $.ajax({
                url: '/ap/support/ah/detail',
                type: "post",
                headers: {token: localStorage.getItem('quiskt')},
                data: {
                    'ahFirstName': ahFirstName,
                    'ahLastName': ahLastName,
                    'accountId': accountId,
                    'ahPhone': ahPhone,
                    'fiName': fiName,
                    'fiNetworkName': fiNetworkName,
                    'fiId': fiId,
                    'partial': 'true'
                },
                success: function (data, textStatus, request) {
                    if (!request.getResponseHeader('token')) {
                        $('.row').remove();
                        $('#main').html(data);
                        return;
                    }
                    document.title = 'Account Holder Summary Profile';
                    $('.panel-body.summary-right').html(data);
                    $('#overlay-title').html(getOverlayTitle(e.target.id));
                    $(".list-group.summary-left a").removeClass('active');
                    $('#' + e.target.id).addClass('active');
                    var modQUP = JSON.parse(request.getResponseHeader('qup'));
                    modQUP.fiName = fiName;
                    modQUP.fiNetworkName = fiNetworkName;
                    sessionStorage.setItem('qup', JSON.stringify(modQUP));
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
    });
    // handles overlay's menu hightlighting
    $(".list-group.summary-left a").on("click", function (e) {
        $(".list-group.summary-left a").removeClass('active');
        var $this = $(this);
        console.dir($this);
        $this.removeClass('active');
        if (!$this.hasClass('active')) {
            $this.addClass('active')
        }
        e.preventDefault();
    });

    // handles trx summary click on trx-id
    $('#main').on('click', '#trx-id', function (e) {
        e.preventDefault();
        var trxId = $(this).text()
        var refTrxId = $(this).data('trxRefId');
        var userProfileInSession = JSON.parse(sessionStorage.getItem('qup'));
        $.ajax({
            url: '/ap/support/ah/detail/transaction-detail',
            type: "post",
            headers: {token: localStorage.getItem('quiskt')},
            data: {
                'trxId': trxId,
                'refTrxId': refTrxId,
                'fiId': userProfileInSession.fiId,
                'ahName': userProfileInSession.firstName+" "+userProfileInSession.lastName
            },
            success: function (data, textStatus, request) {
                if (!request.getResponseHeader('token')) {
                    $('.row').remove();
                    $('#main').html(data);
                    return;
                }
                document.title = 'Account Holder Transaction Detail';
                $('.panel-body.summary-right').html(data);
                $('#overlay-title').html(getOverlayTitle('transaction-detail'));
                //$(".list-group.summary-left a").removeClass('active');
                $('#' + e.target.id).addClass('active');
            },
            error: function (data, textStatus, request) {
                document.title = 'Account Holder Transaction Detail';
                $('.panel-body.summary-right').html(data.responseText);
                $('#overlay-title').html(getOverlayTitle('transaction-detail'));
                //$(".list-group.summary-left a").removeClass('active');
                $('#' + e.target.id).addClass('active');
                //if (data.status == 500) {
                //    $('#msg-row').html('<div class="col-sm-2" id="empty-search" style="text-align: center;"></div><div class="col-md-3 alert alert-danger" style="text-align: center;">' + data.statusText + '</div>');
                //} else {
                //    $('#msg-row').html('<div class="col-sm-2" id="empty-search" style="text-align: center;"></div><div class="col-sm-3 alert alert-danger" style="text-align: center;"></div>');
                //    for (var i = 0; i < data.responseJSON.length; i++) {
                //        $('.col-sm-3.alert.alert-danger').append('<span>' + data.responseJSON[i] + '</span><br>');
                //    }
                //}
            }
        });
    });


    function getOverlayTitle(_key) {
        var titles = {
            'transaction-detail':'Transaction Detail',
            'linked-accounts': 'Linked Accounts',
            'transaction-summary': 'Transaction Summary',
            'preferences-limits': 'Preferences and Limits',
            'kyc': 'Know Your Customer',
            'profile-extended': 'Extended Profile',
            'profile-summary': 'Summary Profile',
            'bill-pay': 'Bill Pay',
            'audit-log': 'Audit Log'
        }
        return titles[_key];
    }

    function setActivityDate() {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
            "July", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var d = new Date();
        var day = d.getDate();
        day = (day < 10) ? '0' + day : day;
        return (day + '-' + monthNames[d.getMonth()] + '-' + d.getFullYear());
    }

    function constructDropDown(mo) {
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
        var dd = $('.form-control.transaction-summary-month');
        for (var z = 0; z < dropdownArray.length; z++) {
            dd.append("<option value=" + z + ">" + dropdownArray[z] + "</option>");
        }
        if(mo) {
            $('.form-control.transaction-summary-month').val(mo);
        }
    }

    function JSON_MONTHS() {
        var monthsJSON = {
            '0': 'Jan',
            '1': 'Feb',
            '2': 'Mar',
            '3': 'Apr',
            '4': 'May',
            '5': 'June',
            '6': 'July',
            '7': 'Aug',
            '8': 'Sep',
            '9': 'Oct',
            '10': 'Nov',
            '11': 'Dec'
        }
        return monthsJSON;
    }
});