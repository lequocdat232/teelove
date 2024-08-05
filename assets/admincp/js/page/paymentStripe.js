$(function(){
    init();
    function clearFormMessage() {
        // $('#inputAddBrand').removeClass('is-invalid');
        // $('#inputAddBrandError').text('');
        // $('#inputEditBrand').removeClass('is-invalid');
        // $('#inputEditBrandError').text('');
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
        var shipping_status = ''
        var row = '';
        var date = new Date(data.created * 1000);
        row += '<tr>' 
            + '<td>'+ data.id +'</td>'
            + '<td>'+ data.id_intent +'</td>' 
            + '<td>'+ data.order_number+'</td>' 
            + '<td><span class="text-success">'+'+ $'+ data.amount_received/100 +'</span></td>'
            + '<td>'+ data.postal_code +'</td>'
            + '<td>'+ data.status +'</td>'
            + '<td>'+ date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear() +'</td>'
            + '<td>'
                + '<button type="button" class="btn cur-p btn-warning btn-edit" data-value=\''+JSON.stringify(data)+'\'>'
                    + '<i class="ti-pencil"></i>'
                + '</button> '
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

    $('.input-daterange input').each(function() {
        $(this).datepicker({
            todayHighlight: false,
            format: 'dd/mm/yyyy',
        });
    });

    function getList() {
        $('#table-loading').css({ display: 'block' });
        $.ajax({
            url: "payment-stripe/get-range" + window.location.search ,
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
    // function createSearchLink(q) {
    //     var search = location.search.substring(1);
    //     var url = location.origin + location.pathname
    //     if (search) {
    //         search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
    //     } else {
    //         search = {}
    //     }
    //     search.q = q;
    //     url += '?'
    //     var se =''
    //     Object.keys(search).map(function(key, index) {
    //        se += '&' + key + '=' + search[key]
    //     });
    //     url += se.substring(1)
        
    //     return url;
    // }
    // create link search
    function createSearchLink(q, startDate, endDate) {
        // var search = location.search.substring(1);
        var search = 'page=1';
        var url = location.origin + location.pathname
        if (search) {
            search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        } else {
            search = {}
        }
        search.q = q;
        search.startDate = startDate;
        search.endDate = endDate;
        url += '?'
        var se =''
        console.log(search);
        Object.keys(search).map(function(key, index) {
           se += '&' + key + '=' + search[key]
        });
        url += se.substring(1)
        
        return url;
    }

    $(`#form_search_stripe`).submit(function(e){
        e.preventDefault()
        $('#searchButton').click()
    })

    $('#searchButton').click(function(e) {
        // e.preventDefault();
        // var startDate = new Date($('#start-date').val()).getTime()/100000;
        // var endDate = new Date($('#end-date').val()).getTime()/100000;
        var startDate = $('#start-date').val() + ' 00:00';
        var endDate = $('#end-date').val() + ' 23:59';
        // console.log(startDate);
        var form = $(this).parents('form:first');
        var data = form.serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        var href = createSearchLink(data.search, startDate, endDate);
        window.history.pushState(null,"", href);
        getList();
    });


    // click on edit button
    $(document).on('click', '.btn-edit', function() {
        clearFormMessage();
        $('#btnEditModal').modal('show');
        // get row data
        var data = $(this).data("value");
        $('#inputEditId').val(data.id)
        $('#inputEditShippingStatus').val(data.shipping_status)
        $('#inputEditOrderStatus').val(data.status)
    });

    // submit form edit member
    $('#btnEdit').click(function(e){
        e.preventDefault();
        clearFormMessage();
        // get form input data
        var data = $('#orderFormEdit').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        data = {
            shipping_status: data.inputShippingStatus,
            order_status: data.inputOrderStatus,
        }
        var id = $('#orderFormEdit #inputEditId').val();
        // send request to server
        $.ajax({
            url: 'order/update-order/' + id,
            type: 'POST',
            dataType: 'json',
            data: data,
        })
        .done(function(response) {
            $('#orderFormEdit').trigger("reset");
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
        });
    })

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
