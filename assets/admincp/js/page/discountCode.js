$(function(){
    init();

    $('input[name="inputAddValidDate"]').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });
  
    $('input[name="inputAddValidDate"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + '-' + picker.endDate.format('DD/MM/YYYY'));
    });
  
    $('input[name="inputAddValidDate"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });
    // clear form message error
    function clearFormMessage() {
        $('#inputAddValidDate').removeClass('is-invalid');
        $('#inputAddValidDateError').text('');
        $('#inputAddDiscountVal').removeClass('is-invalid');
        $('#inputAddDiscountValError').text('');
        $('#inputAddCoupon').removeClass('is-invalid');
        $('#inputAddCouponError').text('');
    }

    // create pagination button
    // change url
    // disable reload page
    $('#pagination-result').on("click", 'a', function() {
        var href = $(this).attr('href');
        window.history.pushState(null,"", href);
        getList();

        return false;
    });

    // create link pagination
    function createPaginationLink(page) {
        var search = location.search.substring(1);
        var url = location.origin + location.pathname
        if (search) {
            search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        } else {
            search = {}
        }
        search.page = page;
        url += '?'
        var se =''
        Object.keys(search).map(function(key, index) {
           se += '&' + key + '=' + search[key]
        });
        url += se.substring(1)
        
        return url;
    }

    
    // render table pagination html
    function renderPagination(data) {
        var paginateHtml = ''
        + '<ul class="pagination justify-content-end mb-0">'
            // Previous Page Link
            if (data.pageth <= 1) {
                paginateHtml += '<li class="page-item disabled">'
                    + '<span class="page-link">Previous</span>'
                + '</li>'
            } else {
                paginateHtml += '<li class="page-item">'
                    + '<a class="page-link" href="' + createPaginationLink(data.pageth - 1) + '">Previous</a>'
                + '</li>'
            }

            // Pagination Elements
            // three dot
            if (data.pageth > 3) {
                paginateHtml += '<li class="page-item">'
                    + '<a class="page-link" href="' + createPaginationLink(1) + '">1</a>'
                + '</li>'
            }
            if (data.pageth > 4) {
                paginateHtml += '<li class="page-item disabled">'
                    + '<span class="page-link">...</span>'
                + '</li>'
            }
            // paginate loop
            for (var i = 0; i < data.pagecount; i++) {
                if (
                    (i + 1) >= data.pageth - 2 
                    && (i + 1) <= data.pageth + 2
                ) {
                    if (i + 1 == data.pageth) {
                        paginateHtml += '<li class="page-item active">'
                            + '<span class="page-link">' + (i + 1) + '</span>'
                        + '</li>'
                    } else {
                        paginateHtml += '<li class="page-item">'
                            + '<a class="page-link" href="' + createPaginationLink(i + 1) + '">' + (i + 1) + '</a>'
                        + '</li>'
                    }
                }
            }
            
            // three dot
            if (data.pageth < data.pagecount - 3) {
                paginateHtml += '<li class="page-item disabled">'
                    + '<span class="page-link">...</span>'
                + '</li>'
            }
            if (data.pageth < data.pagecount - 2) {
                paginateHtml += '<li class="page-item">'
                    + '<a class="page-link" href="' + createPaginationLink(data.pagecount) + '">' + data.pagecount + '</a>'
                + '</li>'
            }
            
            // Next Page Link
            if (data.pageth < data.pagecount) {
                paginateHtml += '<li class="page-item">'
                    + '<a class="page-link" href="' + createPaginationLink(data.pageth + 1) + '">Next</a>'
                + '</li>'
            } else {
                paginateHtml += '<li class="page-item disabled">'
                    + '<span class="page-link">Next</span>'
                + '</li>'
            }
        + '</ul>';

        return paginateHtml;
    }
    // render table row html
    function renderTableRow(data) {
        var row = '';
        var status = ''
        switch (data.status) {
            case '1':
                status = '<span class="badge badge-pill badge-success">Enabled</span>'
                break;
            case '0':
                status = '<span class="badge badge-pill badge-danger">Disabled</span>'
                break;
            default:
                // code...
                break;
        }
        row += '<tr>' 
            + '<td>'+ data.id +'</td>'
            + '<td>'+ data.code +'</td>' 
            + '<td>'+ data.amount +'</td>'
            + '<td>'+ data.type +'</td>'
            + '<td>'+ data.valid_from_date +'</td>'
            + '<td>'+ data.valid_to_date +'</td>'
            + '<td>'+ status +'</td>'
            + '<td>'
                + '<button type="button" class="btn cur-p btn-info btn-edit" data-value=\''+JSON.stringify(data)+'\'>'
                    + '<i class="ti-pencil"></i>'
                + '</button> '
                + '<button type="button" class="btn cur-p btn-danger btn-delete" data-id="' + data.id + '">'
                    + '<i class="ti-trash"></i>'
                + '</button>'
            + '</td>'
        + '</tr>';

        return row;
    }

    // render table html
     function renderTable(data) {
        if (data.length == 0) {
            return '<tr><td colspan="6" class="text-center text-muted">no data</td></tr>'
        }

        var html = '';
        var i;
        for(i = 0; i < data.length; i++){
            html += renderTableRow(data[i])
        }

        return html;
    }

    // render table bottom info
    function renderInfo(data) {
        return 'Showing ' + ((data.pageth - 1) * data.pagelimit + 1) + ' to ' + ((data.pageth) * data.pagelimit) + ' of '+data.recordcount+' entries'
    }

    function getList() {
        $('#table-loading').css({ display: 'block' });
        $.ajax({
            url: "discount-code/get-range" + window.location.search ,
            dataType: 'JSON',
        })
        .done(function(data) {
            $('#showData tbody').html(renderTable(data.data));
            $('#table_info').html(renderInfo(data));
            $('#pagination-result').html(renderPagination(data));
        })
        .fail(function(error) {
            alert('Could not get Data from Database');
            $('#showData tbody').html(renderTable([]));
        })
        .always(function() {
            $('#table-loading').css({ display: 'none' });
        });
    }
    // page init
    function init(){
        getList()
        var search = location.search.substring(1);
        if (search) {
            search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
            $('#search').val(search.q)
        }
    }
    // create link sort
    function createSortLink(sort, type) {
        var search = location.search.substring(1);
        var url = location.origin + location.pathname
        if (search) {
            search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        } else {
            search = {}
        }
        search.sort = sort;
        search.type = type;
        url += '?'
        var se =''
        Object.keys(search).map(function(key, index) {
           se += '&' + key + '=' + search[key]
        });
        url += se.substring(1)
        
        return url;
    }
    // create link search
    function createSearchLink(q) {
        // var search = location.search.substring(1);
        var search = 'page=1';
        var url = location.origin + location.pathname
        if (search) {
            search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        } else {
            search = {}
        }
        search.q = q;
        url += '?'
        var se =''
        Object.keys(search).map(function(key, index) {
           se += '&' + key + '=' + search[key]
        });
        url += se.substring(1)
        
        return url;
    }

    $(`#form_search_discount_code`).submit(function(e){
        e.preventDefault()
        $('#searchButton').click()
    })

    $('#searchButton').click(function(e) {
        e.preventDefault();
        var form = $(this).parents('form:first');
        var data = form.serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        var href = createSearchLink(data.search)
        window.history.pushState(null,"", href);
        getList();
    });

    // click on edit button
    $(document).on('click', '.btn-edit', function() {
        clearFormMessage();
        $('#btnEditModal').modal('show');
        // get row data
        var data = $(this).data("value");
        $('#inputEditId').val(data.id);
        $('#inputEditDiscountVal').val(data.amount);
        $('#selectEditStatus').val(data.status);
        $('#inputEditCoupon').val(data.code);
    });

    // submit form add new product Lot
    $('#btnAdd').click(function(e){
        e.preventDefault();

        clearFormMessage();

        var data = $('#discountCodeFormAdd').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        var dateFrom = $('#inputAddValidDate').val().slice(0, 10);
        var dateTo = $('#inputAddValidDate').val().slice(11, 21);
        data = {
            amount: data.inputAddDiscountVal,
            type  : data.selectTypeDiscount,
            code  : data.inputAddCoupon,
            status: data.selectStatus,
            valid_from_date: dateFrom,
            valid_to_date  : dateTo,
            
        }
        console.log(data);
        $.ajax({
            url: 'discount-code/add-code',
            type: 'POST',
            dataType: 'json',
            data: data,
        })
        .done(function(response) {
            $('#discountCodeFormAdd').trigger("reset");
            $('#btnAddModal').css('display','none');
            $('#btnAddModal').css('padding-right','0');
            $('.modal-backdrop').remove();
            Swal(
                'Good job!',
                'Your data has been updated.',
                'success'
            ).then(() => {
                getList();
            })
        })
        .fail(function(error) {
            var json = JSON.parse(error.responseText);
            if (json.amount) {
                $('#inputAddDiscountVal').addClass('is-invalid');
                $('#inputAddDiscountValError').text(json.amount);
            }
            if (json.code) {
                $('#inputAddCoupon').addClass('is-invalid');
                $('#inputAddCouponError').text(json.code);
            }
            if (json.valid_from_date) {
                $('#inputAddValidDate').addClass('is-invalid');
                $('#inputAddValidDateError').text(json.valid_from_date);
            }
        });
    })
    // submit form edit voa price
    $('#btnEdit').click(function(e){
        e.preventDefault();
        clearFormMessage();
        // get form input data
        var data = $('#discountCodeFormEdit').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        data = {
            amount: data.inputEditDiscountVal,
            status: data.selectEditStatus,
        }

        var id = $('#discountCodeFormEdit #inputEditId').val();
        // send request to server
        $.ajax({
            url: 'discount-code/update-code/' + id,
            type: 'POST',
            dataType: 'json',
            data: data,
        })
        .done(function(response) {
            $('#brandFormEdit').trigger("reset");
            $('#btnEditModal').modal('hide');
            Swal(
                'Good job!',
                'Your data has been updated.',
                'success'
            ).then(() => {
                getList();
            })
        })
        .fail(function(error) {
            var json = JSON.parse(error.responseText);
            if (json.brand_name) {
                $('#inputEditBrand').addClass('is-invalid');
                $('#inputEditBrandError').text(json.brand_id);
            }
        });
    })

    // click on delete button
    $(document).on('click', '.btn-delete', function() {
        // get row id
        var id = $(this).data("id");
        Swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    url: 'discount-code/delete-code/' + id,
                    type: 'POST',
                    dataType: 'json',
                })
                .done(function(response) {
                    Swal(
                      'Deleted!',
                      'Your data has been deleted.',
                      'success'
                    ).then(() => {
                        getList();
                    })
                })
                .fail(function(error) {
                    Swal(
                      'Fail!',
                      'Can not deleted.',
                      'error'
                    )
                });
            }
        })
    });

    // When clicking on a table header, perform some sorting.
    $(document).on('click', 'table thead tr th', function() {
        var self = $(this)

        if (self.index() != 0) {
            return;
        }

        // Setup sort direction, defaulting to ascending and reversing
        // direction if previously set.
        var asc = self.attr("asc") == "true" ? false : true
        self.attr("asc", asc)

        // Clear all directions
        $(".dir").html("")

        // Setup current direction flag
        self.find(".dir").html(asc ? "&nbsp;(&#9650;)" : "&nbsp;(&#9660;)")

        // Sort!
        var href = createSortLink('id', asc ? 'asc' : 'desc')
        window.history.pushState(null,"", href);
        getList();
    })

    // Affix a .dir to every th
    $("table thead th").append("<span class=\"dir\"></span>");

})
