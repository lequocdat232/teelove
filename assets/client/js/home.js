$('#btn-filter').click(function () {
    let filterPriceMinValue = $('#filter-price__min-value').text()
    let filterPriceMaxValue = $('#filter-price__max-value').text()
    console.log(filterPriceMinValue, '-', filterPriceMaxValue);
    let search = '?min=' + filterPriceMinValue + '&max=' + filterPriceMaxValue
    let color = $('.input-check-color__input').map(function() {
        if ($(this).attr('checked')) {
            return this.value;
        }
        // return $(this).attr('checked');
    }).get();
    console.log(color, '111');
    color = color.join('&color[]=')
    if (color.length > 0) {
        search += '&color[]=' + color
    }
    let brand = $('input[name=filter_radio]:checked').val()
    if (brand) {
        search += '&brand=' + brand
    }
    window.history.pushState(null,"", window.location.pathname + search);
    var url = '/api' + window.location.pathname + search
    sendRequestGetList(url)
})

function sendRequestGetList(url) {
    $.ajax({
        url,
        type: 'GET',
        dataType: "json"
    })
    .done(function(response) {
        console.log("success", response, typeof response);
        $('#products-list__body').empty()
        let keys = Object.keys(response.data)
        keys.forEach(function(element) {
            // console.log(element);
            let product = response.data[element]
            // console.log(product);
            $('#products-list__body').append(`
                <div class="products-list__item">
                    <div class="product-card"><button class="product__actions-item--wishlist--home" type="button" data-id="${product.product_id}"><svg width="16px" height="16px">
                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#wishlist-16"></use>
                            </svg> <span class="fake-svg-icon"></span></button>
                        <div class="product-card__badges-list">
                            <div class="product-card__badge product-card__badge--new">New</div>
                        </div>
                        <div class="product-card__image"><a href="/product/${product.slug}"><img src="${product.url}" alt=""></a></div>
                        <div class="product-card__info">
                            <div class="product-card__name"><a href="/product/${product.slug}">${product.lot_name}</a></div>
                            <div class="product-card__rating">
                                <div class="rating">
                                    <div class="rating__body"><svg class="rating__star rating__star--active" width="13px" height="12px">
                                            <g class="rating__fill">
                                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#star-normal"></use>
                                            </g>
                                            <g class="rating__stroke">
                                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#star-normal-stroke"></use>
                                            </g>
                                        </svg>
                                        <div class="rating__star rating__star--only-edge rating__star--active">
                                            <div class="rating__fill">
                                                <div class="fake-svg-icon"></div>
                                            </div>
                                            <div class="rating__stroke">
                                                <div class="fake-svg-icon"></div>
                                            </div>
                                        </div><svg class="rating__star rating__star--active" width="13px" height="12px">
                                            <g class="rating__fill">
                                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#star-normal"></use>
                                            </g>
                                            <g class="rating__stroke">
                                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#star-normal-stroke"></use>
                                            </g>
                                        </svg>
                                        <div class="rating__star rating__star--only-edge rating__star--active">
                                            <div class="rating__fill">
                                                <div class="fake-svg-icon"></div>
                                            </div>
                                            <div class="rating__stroke">
                                                <div class="fake-svg-icon"></div>
                                            </div>
                                        </div><svg class="rating__star rating__star--active" width="13px" height="12px">
                                            <g class="rating__fill">
                                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#star-normal"></use>
                                            </g>
                                            <g class="rating__stroke">
                                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#star-normal-stroke"></use>
                                            </g>
                                        </svg>
                                        <div class="rating__star rating__star--only-edge rating__star--active">
                                            <div class="rating__fill">
                                                <div class="fake-svg-icon"></div>
                                            </div>
                                            <div class="rating__stroke">
                                                <div class="fake-svg-icon"></div>
                                            </div>
                                        </div><svg class="rating__star rating__star--active" width="13px" height="12px">
                                            <g class="rating__fill">
                                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#star-normal"></use>
                                            </g>
                                            <g class="rating__stroke">
                                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#star-normal-stroke"></use>
                                            </g>
                                        </svg>
                                        <div class="rating__star rating__star--only-edge rating__star--active">
                                            <div class="rating__fill">
                                                <div class="fake-svg-icon"></div>
                                            </div>
                                            <div class="rating__stroke">
                                                <div class="fake-svg-icon"></div>
                                            </div>
                                        </div><svg class="rating__star" width="13px" height="12px">
                                            <g class="rating__fill">
                                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#star-normal"></use>
                                            </g>
                                            <g class="rating__stroke">
                                                <use xlink:href="`+ base_url +`assets/client/images/sprite.svg#star-normal-stroke"></use>
                                            </g>
                                        </svg>
                                        <div class="rating__star rating__star--only-edge">
                                            <div class="rating__fill">
                                                <div class="fake-svg-icon"></div>
                                            </div>
                                            <div class="rating__stroke">
                                                <div class="fake-svg-icon"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="product-card__rating-legend">9 Reviews</div>
                            </div>
                            <ul class="product-card__features-list">
                                <li>Speed: 750 RPM</li>
                                <li>Power Source: Cordless-Electric</li>
                                <li>Battery Cell Type: Lithium</li>
                                <li>Voltage: 20 Volts</li>
                                <li>Battery Capacity: 2 Ah</li>
                            </ul>
                        </div>
                        <div class="product-card__actions">
                            <div class="product-card__availability">Availability: <span class="text-success">In Stock</span></div>
                            <div class="product-card__prices">$${(new Number(product.price)).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            `)
        });
        $('#products-view__pagination').html(renderPagination(response));
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });
}

// render table pagination html
function renderPagination(data) {
    var paginateHtml = ''
    + '<ul class="pagination justify-content-center">'
        // Previous Page Link
        if (data.pageth <= 1) {
            paginateHtml += '<li class="page-item disabled">'
                + '<span class="page-link">'
                    + '<svg class="page-link__arrow page-link__arrow--left" aria-hidden="true" width="8px" height="13px">'
                        + '<use xlink:href="/assets/client/images/sprite.svg#arrow-rounded-left-8x13"></use>'
                    + '</svg>'
                + '</span>'
            + '</li>'
        } else {
            paginateHtml += '<li class="page-item">'
                + '<a class="page-link" href="' + (data.pageth - 1) + '">'
                    + '<svg class="page-link__arrow page-link__arrow--left" aria-hidden="true" width="8px" height="13px">'
                        + '<use xlink:href="/assets/client/images/sprite.svg#arrow-rounded-left-8x13"></use>'
                    + '</svg>'
                + '</a>'
            + '</li>'
        }

        // Pagination Elements
        // three dot
        if (data.pageth > 3) {
            paginateHtml += '<li class="page-item">'
                + '<a class="page-link" href="' + 1 + '">1</a>'
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
                        + '<a class="page-link" href="' + (i + 1) + '">' + (i + 1) + '</a>'
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
                + '<a class="page-link" href="' + data.pagecount + '">' + data.pagecount + '</a>'
            + '</li>'
        }
        
        // Next Page Link
        if (data.pageth < data.pagecount) {
            paginateHtml += '<li class="page-item">'
                + '<a class="page-link" href="' + (data.pageth + 1) + '">'
                    + '<svg class="page-link__arrow page-link__arrow--right" aria-hidden="true" width="8px" height="13px">'
                        + '<use xlink:href="/assets/client/images/sprite.svg#arrow-rounded-right-8x13"></use>'
                    + '</svg>'
                + '</a>'
            + '</li>'
        } else {
            paginateHtml += '<li class="page-item disabled">'
                + '<span class="page-link">'
                    + '<svg class="page-link__arrow page-link__arrow--right" aria-hidden="true" width="8px" height="13px">'
                        + '<use xlink:href="/assets/client/images/sprite.svg#arrow-rounded-right-8x13"></use>'
                    + '</svg>'
                + '</span>'
            + '</li>'
        }
    + '</ul>';

    return paginateHtml;
}

$('.input-check-color__body').click(function (e) {
    e.preventDefault();
    // let input = $(this).parent('label').children('input')
    let input = $(this).children('input')
    if (input.attr( "checked")) {
        // console.log('remove color', input.attr( "checked"));
        input.removeAttr('checked')
    } else {
        // console.log('add color', input.attr( "checked"));
        input.attr( "checked", 'checked' );
    }
})

$(document).on('click', '.products-view__pagination .pagination a.page-link', function(e) {
    console.log($(this).attr('href').replace('#', ''));
    var page = $(this).attr('href').replace('#', '');
    var search = window.location.search
    var search = location.search.substring(1);
    if (search) {
        search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
    } else {
        search = {}
    }

    search.page = page
    var url = location.pathname
    url += '?'
    var se =''
    Object.keys(search).map(function(key, index) {
       se += '&' + key + '=' + search[key]
    });
    url += se.substring(1)
    
    console.log(search, url);
    window.history.pushState(null,"", url);
    // $('.products-view__pagination .pagination li').removeClass('active')
    // $(this).parents('li').addClass('active')
    sendRequestGetList('/api' + url)
    return false;
});


$(document).on('click', '.product__actions-item--wishlist--home', function(e) {
    var product_id = $(this).data('id');
    // var slug = $(this).data('slug');
    // Check dieu kien da login
    if (!$('#user_id').val()) {
        // Check dieu kien chua login
        $.ajax({
            url: base_url + 'info-product-add-wish-list',
            type: 'POST',
            dataType: 'json',
            data: {
                id: product_id
            }
        })
        .done(function(response){
            let wishList = [];
            if(window.localStorage.wishList) {
                wishList = JSON.parse(window.localStorage.wishList)
            }
            if(wishList.length === 0) {
                wishList.push({
                    product_id,
                    product: response
                })
            } else {
                var isExist = false;
                $.each(wishList, function(index, val) {
                    if (val && val.product_id == product_id && wishList[index]) {
                        isExist = true
                    }
                });
                if (!isExist) {
                    wishList.push({
                        product_id,
                        product: response
                    })
                }
            }
            wishList = wishList.filter(function(val) {
                return val != null;
            });
            window.localStorage.wishList = JSON.stringify(wishList);
            // updateWishListHeader(wishList);
        })
        .fail(function() {
            // console.log("Error!!!");
        })
        .always(function() {
            // console.log("Complete!!!");
        })
    }
    else {
        $.ajax({
            url: '/add-wish-list',
            type: 'POST',
            dataType: 'json',
            data: {
                user_id: $('#user_id').val(), 
                product_id,
            },
        })
        .done(function(response) {
            
        })
        .fail(function() {
        })
        .always(function() {
        });
    }
    
        
});
