function Tables() {
    var Table = $('#tables').DataTable({
        "responsive": true,
        "ajax": {
            url: "./api/route?data",
            headers: {
                "Api": $.cookie("BSK_API"),
                "Key": $.cookie("BSK_KEY"),
                "Accept": "application/json"
            },
            method: "POST"
        },
        "columns": [{
                "data": "router"
            },
            {
                "data": "address",
            },
            {
                "data": "gateway"
            },
            {
                "data": "distance"
            },
            {
                "data": "mark"
            },
            {
                "data": "id",
                className: 'dt-body-right',
                render: function (data, type, row) {
                    var btn = (row.status == 'false' ?
                        '<button name="active" data-target="route" class="btn btn-success btn-sm" title="On" value="' + row.identity + row.id + '"><i class="fa fa-eye"></i></button>' :
                        '<button name="active" data-target="route" class="btn btn-danger btn-sm" title="Off" value="' + row.identity + row.id + '"><i class="fa fa-eye-slash"></i></button>');
                    return '<div class="btn-group">' + btn + '<button data-toggle="dropdown" class="btn btn-info btn-sm"><i class="fa fa-cog"></i></button>' +
                        '<div role="menu" class="dropdown-menu dropdown-menu-right">' +
                        '<a class="dropdown-item" data-toggle="modal" href="#add-data" data-value="' + row.identity + row.id + '" title="Edit"><i class="fa fa-edit"></i> Edit</a>' +
                        '<a class="dropdown-item" data-toggle="modal"  href="#delete" data-value="' + row.identity + row.id + '" data-target="route" title="Delete"><i class="fa fa-trash"></i> Delete</a>' +
                        '</div>' +
                        '</div>';
                }
            }
        ],
        oLanguage: {
            sLengthMenu: "_MENU_",
            sSearch: "",
            sSearchPlaceholder: "Search...",
            oPaginate: {
                sPrevious: "<i class='fa fa-backward'></i>",
                sNext: "<i class='fa fa-forward'></i>"
            }
        },
        aLengthMenu: [
            [5, 10, 15, 20, 50, 75, -1],
            [5, 10, 15, 20, 50, 75, "All"]
        ],
        iDisplayLength: 10
    });
};

function Selected(data, value) {
    $.ajax({
        url: "./api/route",
        headers: {
            "Api": $.cookie("BSK_API"),
            "Key": $.cookie("BSK_KEY"),
            "Accept": "application/json"
        },
        data: {
            "router": data
        },
        method: "GET",
        dataType: "JSON",
        beforeSend: function () {
            $('#mark').empty().html('<option value="">-- None --</option>').val(value);
        },
        success: function (routers) {
            $.each(routers.data, function (i, vals) {
                $('#mark').append('<option value="' + vals.name + '">' + vals.name + '</option>').val(value);
            });
            $("#gateway").autocomplete({
                source: routers.value
            });
        }
    });
}

function Action() {
    $.ajax({
        url: "./api/route",
        headers: {
            "Api": $.cookie("BSK_API"),
            "Key": $.cookie("BSK_KEY"),
            "Accept": "application/json"
        },
        method: "GET",
        dataType: "JSON",
        data: "server",
        success: function (response) {
            $.each(response.data, function (i, param) {
                $('#server, #router').append('<option value="' + param.id + '">' + param.name + '</option>');
            });
        }
    });
    $('#router').change(function () {
        Selected($(this).val(), '');
    });
}

function Change() {
    $('body').on('click', '[href="#add-data"]', function () {
        var id_data = $(this).data('value');
        $('#id').val(id_data);
        $('#form-data').trigger('reset');
        $('#router').attr('disabled', false);
        $('#mark').empty().html('<option value="">-- None --</option>');
        $.ajax({
            url: "./api/route",
            headers: {
                "Api": $.cookie("BSK_API"),
                "Key": $.cookie("BSK_KEY"),
                "Accept": "application/json"
            },
            method: "GET",
            dataType: "JSON",
            data: {
                "detail": id_data
            },
            success: function (detail) {
                $('#router').attr('disabled', detail.status);
                if (detail.status) {
                    $.each(detail.data, function (i, show) {
                        $('#' + i).val(show);
                    });
                    Selected(detail.data.router, detail.data.mark);
                    $('#status').bootstrapToggle(detail.data.status ? 'on' : 'off');
                }
            }
        });
    });
}
(function () {
    'use strict';
    Tables();
    Action();
    Change();
    $('#server').change(function () {
        $('#tables').DataTable().ajax.url("./api/route?data=" + $(this).val()).load();
    });
})();