$(function(){
    init();

    // clear form message error
    function clearFormMessage() {
        $('#inputAddName').removeClass('is-invalid');
        $('#inputAddNameError').text('');
        $('#inputEditBrand').removeClass('is-invalid');
        $('#inputEditBrandError').text('');
    }

    // clear form message error
    function clearFormData() {
        $('#inputAddName').val('');
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
        row += '<tr>' 
            + '<td>'+ data.id +'</td>'
            + '<td>'+ data.name +'</td>' 
            + '<td>'+ (data.parent || '') +'</td>' 
            + '<td>'+ (data.orderBy) +'</td>' 
            + '<td>'+ data.created_at +'</td>'
            + '<td>'+ data.updated_at +'</td>'
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
            url: "category/get-range" + window.location.search ,
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

    $(`#form_search_member`).submit(function(e){
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

    function mapData(categories, id = 0) {
        // console.log(categories, 'categories');
        // for (var i = 0; i < categories.length; i++) {
        //     if (categories[i].parent_id === id) {
        //         var data = []
        //         mapData(categories, categories[i].parent_id)
        //     }
        // }
        return categories
    }

    // click on edit button
    $(document).on('click', '.btn-edit', function() {
        clearFormMessage();
        clearFormData();
        var data = $(this).data("value");
        $.ajax({
            url: '/admincp/category/get-all',
            type: 'GET',
            dataType: 'JSON'
        })
        .done(function(response) {
            $('#btnEditModal').modal('show');
            var select = document.getElementById("inputEditParent");
            $("#inputEditParent").empty();
            var option = document.createElement("option");
            option.text = 'select parent';
            option.value = 0;
            select.appendChild(option);
            cate_tree(response)
            function cate_tree(data, parent_id = 0, string = '--') {
                $.each(data, function(index, el) {
                    if(data[index] === null) return
                    if(el.parent_id == parent_id) {
                        var option = document.createElement("option");
                        option.text = string + el.name;
                        option.value = el.id;
                        select.appendChild(option);  
                        data[index] = null
                        cate_tree(data, el.id, string + string)
                    }
                });
            }
            // get row data
            $('#inputEditId').val(data.id)
            $('#inputEditName').val(data.name)
            $('#inputEditParent').val(data.parent_id)
            $('#inputEditOrder').val(data.orderBy)
            console.log("success", response);
        })
        .fail(function() {
            alert('server error')
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
    });

    // click on add button
    $(document).on('click', '#btnAddModal', function() {
        clearFormMessage();
        clearFormData();
        $.ajax({
            url: '/admincp/category/get-all',
            type: 'GET',
            dataType: 'JSON'
        })
        .done(function(response) {
            $('#addModal').modal('show');
            var select = document.getElementById("inputAddParent");
            $("#inputAddParent").empty();
            var option = document.createElement("option");
            option.text = 'select parent';
            option.value = 0;
            select.appendChild(option);
            let categories = mapData(response)
            cate_tree(response)
            function cate_tree(data, parent_id = 0, string = '--') {
                $.each(data, function(index, el) {
                    if(data[index] === null) return
                    if(el.parent_id == parent_id) {
                        var option = document.createElement("option");
                        option.text = string + el.name;
                        option.value = el.id;
                        select.appendChild(option);  
                        data[index] = null
                        cate_tree(data, el.id, string + string)
                    }
                });
            }
            
        })
        .fail(function() {
            alert('server error')
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
    });

    // submit form add new product Lot
    $('#btnAdd').click(function(e){
        e.preventDefault();

        clearFormMessage();

        var data = $('#categoryFormAdd').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        $.ajax({
            url: 'category/add-category',
            type: 'POST',
            dataType: 'json',
            data: data,
        })
        .done(function(response) {
            $('#brandFormAdd').trigger("reset");
            // $('#btnAddModal').css('display','none');
            // $('#btnAddModal').css('padding-right','0');
            $('.modal-backdrop').remove();
            $('#addModal').modal('hide');
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
            if (json.inputName) {
                $('#inputAddName').addClass('is-invalid');
                $('#inputAddNameError').text(json.inputName);
            }
        });
    })
    // submit form edit voa price
    $('#btnEdit').click(function(e){
        e.preventDefault();
        clearFormMessage();
        // get form input data
        var data = $('#categoryFormEdit').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        var id = $('#categoryFormEdit #inputEditId').val();
        // send request to server
        $.ajax({
            url: 'category/update-category/' + id,
            type: 'POST',
            dataType: 'json',
            data: data,
        })
        .done(function(response) {
            $('#categoryFormEdit').trigger("reset");
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
                console.log(id, '---------');
                $.ajax({
                    url: 'category/delete-category/' + id,
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
