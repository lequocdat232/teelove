$(function(){
    init();

    // clear form message error
    function clearFormMessage() {
        $('#inputAddBrand').removeClass('is-invalid');
        $('#inputAddBrandError').text('');
        $('#inputEditBrand').removeClass('is-invalid');
        $('#inputEditBrandError').text('');

    
        $('#inputAddLotName').removeClass('is-invalid');
        $('#inputAddLotNameError').text('');
        $('#inputAddPrice').removeClass('is-invalid');
        $('#inputAddPriceError').text('');

        $('#inputEditLotName').removeClass('is-invalid');
        $('#inputEditLotNameError').text('');
        $('#inputEditPrice').removeClass('is-invalid');
        $('#inputEditPriceError').text('');
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
        var qty = 0;
        var price = 0;
        $.each(data['cart_data'], function(index, val) {
            qty += val.qty
            price += +val.qty * +val.product.price
        });
        var stringData = JSON.stringify(data).replace(/\'/g, "\\'")
        stringData = stringData.replace(/\"/g, "\'")
        row += '<tr>' 
            + '<td>'+ data.id +'</td>'
            + '<td>'+ data.fullname +'</td>' 
            + '<td>'+ data.email +'</td>'
            + '<td>'+ qty +'</td>' 
            + '<td>'+ (new Number(price)).toLocaleString()+ ' $'+'</td>'
            + '<td>'+ data.created_at +'</td>'
            + '<td>'+ data.updated_at +'</td>'
            + '<td>'
                + '<button type="button" class="btn cur-p btn-info btn-view-detail" data-value="' + stringData +'">'
                    + '<i class="ti-eye"></i>'
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
            url: "cart/get-range" + window.location.search ,
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
        var search = location.search.substring(1);
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

    $(`#form_search_cart`).submit(function(e){
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
        var href = createSearchLink(data.search);
        window.history.pushState(null,"", href);
        getList();
    });

    // click on edit button
    $(document).on('click', '.btn-view-detail', function() {
        var data = $(this).data("value");
        data = data.replace(/'/g, "\"")
        data = data.replace(/\\'/g, "'")
        data = JSON.parse(data)
        $('#cart-list').css({display: 'none'})
        $('#cart-detail').css({display: 'block'})
        $('#cart-detail tbody').html(renderTableDetail(data.cart_data));
    });

    // render table html
     function renderTableDetail(data) {
        // console.log(data);
        if (data.length == 0) {
            return
        }

        var html = '';
        var i;
        for(i = 0; i < data.length; i++){
            html += renderRowDetail(data[i])
        }

        return html;
    }

    // render table row html
    function renderRowDetail(data) {
        // console.log(data);
        var row = '';
        row += '<tr>' 
            + '<td>'+ data.product.lot_name +'</td>'
            + '<td><img src=" ' + data.product.url + '"alt="'+ data.product.lot_name +'" height="70"></td>'
            + '<td>'+ data.qty +'</td>' 
            + '<td>'+ (new Number(data.product.price)).toLocaleString() +'</td>'
        + '</tr>';

        return row;
    }

    $(document).on('click', '#btn-back', function () {
        $('#cart-list').css({display: 'block'})
        $('#cart-detail').css({display: 'none'})
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
