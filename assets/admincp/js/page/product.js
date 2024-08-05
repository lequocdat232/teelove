$(function(){
    init();

    // clear form message error
    function clearFormMessage() {
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
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    // render table row html
    function renderTableRow(data) {
        var row = '';
        // console.log(data);
        var stringData = JSON.stringify(data).replace(/\'/g, "\\'")
        stringData = stringData.replace(/\"/g, "\'")
        row += '<tr>' 
            + '<td>'+ data.id +'</td>'
            + '<td><img src="'+ data.img+'" alt="'+ data.product_lot_name +'" height="70"></td>' 
            + '<td>'+ data.product_lot_name +'</td>' 
            + '<td>'+ formatNumber(data.price) + '$' +'</td>'
            + '<td>'+ data.product_qty +'</td>'
            + '<td>'+ data.brand_name +'</td>'
            + '<td>'+ data.product_attr_value +'</td>'
            + '<td>'
                + '<button type="button" class="btn cur-p btn-info btn-edit" data-value="' + stringData +'">'
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
            url: "product/list" + window.location.search ,
            dataType: 'JSON',
        })
        .done(function(data) {;
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

    $(`#form_search_product`).submit(function(e){
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

    $('#form-search').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
            e.preventDefault();
            var data = $(this).serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            var href = createSearchLink(data.search)
            window.history.pushState(null,"", href);
            getList();
            return false;
        }
    });

    var new_images = [];
    var rm_id = []

    $(document).on('change', '#inputEditImage', function(e) {
        console.log(123);
        let file = e.target.files[0]
        // console.log(file);
        let formData = new FormData();
        formData.append('file', file);

        $.ajax({
            url: '/admincp/upload',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        })
        .done(function(response) {
            let pewview = document.getElementById('imgPriview')
            pewview.innerHTML += '<div class="item-file-preview">'
                + '<img src="' + response + '" width="100">'
                + '<button type="button" class="close btn-remove-file-preview" data-type="new" data-id="'+new_images.length+'"><span aria-hidden="true">&times;</span></button>'
            + '</div>'
            new_images.push(response)
            console.log(new_images, 'push new_images');
        })
        .fail(function(error) {
            console.log("error", error);
        })
        .always(function() {
            console.log("complete");
        });
    })

    // click on edit button
    $(document).on('click', '.btn-edit', function() {
        clearFormMessage();
        $('#btnEditModal').modal('show');
        // get row data
        var data = $(this).data("value");
        data = data.replace(/'/g, "\"")
        data = data.replace(/\\'/g, "'")
        data = JSON.parse(data)
        $('#inputEditId').val(data.id)
        $("#imgPriview").attr("src", data.images[0].url);
        renderPreviewImage(data.images)
        // $('#inputEditImage').val(data.img)
        $('#inputEditAttrValue').val(data.product_lot_name + ' ' + data.product_attr_value)
        $('#inputEditPrice').val(data.price)
        $('#inputEditQty').val(data.product_qty)
        $('#inputEditDetail').val(data.product_detail)
    });

    function renderPreviewImage(images) {
        let pewview = document.getElementById('imgPriview')
        pewview.innerHTML = ''
        for (let i = 0; i < images.length; i++) {
            images[i]
            pewview.innerHTML += '<div class="item-file-preview">'
                + '<img src="' + images[i].url + '" width="100">'
                + '<button type="button" class="close btn-remove-file-preview" data-type="old" data-id="'+images[i].id+'"><span aria-hidden="true">&times;</span></button>'
            + '</div>'
        }
    }

    $(document).on('click', '.btn-remove-file-preview', function(e) {
        var type = $(this).data("type");
        var id = $(this).data("id");
        $(this).parents('div.item-file-preview').remove()
        console.log(id, '-------');
        if (type === "new") {
            console.log('rm new');
            new_images[id] = null
            console.log(new_images, 'new_images');
        } else {
            console.log('rm old');
            rm_id.push(id)
            console.log(rm_id, 'rm_id');
        }
    })

    $('#btnEdit').click(function(e){
        e.preventDefault();
        clearFormMessage();
        // get form input data
        var data = $('#productLotFormEdit').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        console.log(data);
        data = {
            attr_value: data.inputEditAttrValue,
            price: data.inputEditPrice,
            qty: data.inputEditQty,
            // img: $('#imgPriview').attr('src'),
            detail: data.inputEditDetail,
            rm_id,
            new_images: new_images.filter(function(e) { return e !== null })
        }

        console.log(data);

        var id = $('#productLotFormEdit #inputEditId').val();
        // send request to server
        $.ajax({
            url: '/admincp/product/update/' + id,
            type: 'POST',
            dataType: 'json',
            data: data,
        })
        .done(function(response) {
            $('#productLotFormEdit').trigger("reset");
            $('#btnEditModal').modal('hide');
            // $('#btnEditModal').css('display','none');
            // $('#btnEditModal').css('padding-right','0');
            // $('.modal-backdrop').remove();
            Swal(
                'Good job!',
                'Your data has been updated.',
                'success'
            ).then(() => {
                getList();
                new_images = [];
                rm_id = []
            })
        })
        .fail(function(error) {
            var json = JSON.parse(error.responseText);
            if (json.attr_value) {
                $('#inputEditAttrValue').addClass('is-invalid');
                $('#inputEditAttrValueError').text(json.attr_value);
            }
            if (json.price) {
                $('#inputEditPrice').addClass('is-invalid');
                $('#inputEditPriceError').text(json.price);
            }
            if (json.qty) {
                $('#inputEditQty').addClass('is-invalid');
                $('#inputEditQtyError').text(json.qty);
            }
            if (json.detail) {
                $('#inputEditDetail').addClass('is-invalid');
                $('#inputEditDetailError').text(json.detail);
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
                    url: '/admincp/product/delete/' + id,
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
