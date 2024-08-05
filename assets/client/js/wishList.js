$(document).ready(function() {
    if( !$('#user_id').val()) {
        var wishList = JSON.parse(window.localStorage.wishList);
        if(Object.entries(wishList).length === 0 || wishList.constructor === Object)
        {   
            $('.wishlist__head').remove();
            $('#wish-list-data').append(
                `
                <div class="block-empty__body"><div class="block-empty__message">Your shopping wish list is empty!</div></div>
                `
            );
        }
        else {
            // $('.wishlist__head').remove();
            $.each(wishList, function(index, val) {
                var prototype1 = val.product.attr_field_text.toLowerCase();
                $('#wish-list-data').append(
                    `
                            <tr class="wishlist__row">
                                <td class="wishlist__column wishlist__column--image">
                                    <div class="product-image">
                                        <a  class="product-image__body" href="${base_url}product/${val.product.lot_slug}">
                                            <img class="product-image__img" src="${val.product.url}" alt="">
                                        </a>
                                    </div>
                                </td>
                                <td class="wishlist__column wishlist__column--product">
                                    <a href="${base_url}product/${val.product.lot_slug}" class="wishlist__product-name">${val.product.lot_name}</a>
                                    <div class="wishlist__product-rating">
                                        <div class="rating">
                                            <div class="rating__body">
                                                <svg class="rating__star rating__star--active" width="13px" height="12px">
                                                    <g class="rating__fill">
                                                        <use xlink:href="${base_url}assets/client/images/sprite.svg#star-normal"></use>
                                                    </g>
                                                    <g class="rating__stroke">
                                                        <use xlink:href="${base_url}assets/client/images/sprite.svg#star-normal-stroke"></use>
                                                    </g>
                                                </svg>
                                                <div class="rating__star rating__star--only-edge rating__star--active">
                                                    <div class="rating__fill">
                                                        <div class="fake-svg-icon"></div>
                                                    </div>
                                                    <div class="rating__stroke">
                                                        <div class="fake-svg-icon"></div>
                                                    </div>
                                                </div>
                                                <svg class="rating__star rating__star--active" width="13px" height="12px">
                                                    <g class="rating__fill">
                                                        <use xlink:href="${base_url}assets/client/images/sprite.svg#star-normal"></use>
                                                    </g>
                                                    <g class="rating__stroke">
                                                        <use xlink:href="${base_url}assets/client/images/sprite.svg#star-normal-stroke"></use>
                                                    </g>
                                                </svg>
                                                <div class="rating__star rating__star--only-edge rating__star--active">
                                                    <div class="rating__fill">
                                                        <div class="fake-svg-icon"></div>
                                                    </div>
                                                    <div class="rating__stroke">
                                                        <div class="fake-svg-icon"></div>
                                                    </div>
                                                </div>
                                                <svg class="rating__star rating__star--active" width="13px" height="12px">
                                                    <g class="rating__fill">
                                                        <use xlink:href="${base_url}assets/client/images/sprite.svg#star-normal"></use>
                                                    </g>
                                                    <g class="rating__stroke">
                                                        <use xlink:href="${base_url}assets/client/images/sprite.svg#star-normal-stroke"></use>
                                                    </g>
                                                </svg>
                                                <div class="rating__star rating__star--only-edge rating__star--active">
                                                    <div class="rating__fill">
                                                        <div class="fake-svg-icon"></div>
                                                    </div>
                                                    <div class="rating__stroke">
                                                        <div class="fake-svg-icon"></div>
                                                    </div>
                                                </div>
                                                <svg class="rating__star rating__star--active" width="13px" height="12px">
                                                    <g class="rating__fill">
                                                        <use xlink:href="${base_url}assets/client/images/sprite.svg#star-normal"></use>
                                                    </g>
                                                    <g class="rating__stroke">
                                                        <use xlink:href="${base_url}assets/client/images/sprite.svg#star-normal-stroke"></use>
                                                    </g>
                                                </svg>
                                                <div class="rating__star rating__star--only-edge rating__star--active">
                                                    <div class="rating__fill">
                                                        <div class="fake-svg-icon"></div>
                                                    </div>
                                                    <div class="rating__stroke">
                                                        <div class="fake-svg-icon"></div>
                                                    </div>
                                                </div>
                                                <svg class="rating__star " width="13px" height="12px">
                                                    <g class="rating__fill">
                                                        <use xlink:href="${base_url}assets/client/images/sprite.svg#star-normal"></use>
                                                    </g>
                                                    <g class="rating__stroke">
                                                        <use xlink:href="${base_url}assets/client/images/sprite.svg#star-normal-stroke"></use>
                                                    </g>
                                                </svg>
                                                <div class="rating__star rating__star--only-edge ">
                                                    <div class="rating__fill">
                                                        <div class="fake-svg-icon"></div>
                                                    </div>
                                                    <div class="rating__stroke">
                                                        <div class="fake-svg-icon"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="wishlist__product-rating-legend">
                                            9 Reviews
                                        </div>
                                    </div>
                                </td>
                                <td class="wishlist__column wishlist__column--stock">
                                    <span>${val.product.attr_field_text}: </span>
                                    <i><strong>${val.product.attr_value}</strong></i>
                                </td>
                                <td class="wishlist__column wishlist__column--stock">
                                    <div class="badge badge-success">${val.product.qty}</div>
                                </td>
                                <td class="wishlist__column wishlist__column--price">$${val.product.price}</td>
                                <td class="wishlist__column wishlist__column--tocart">
                                    <button type="button" class="btn btn-primary btn-sm">Add To Cart</button>
                                </td>
                                <td class="wishlist__column wishlist__column--remove">
                                    <button type="button" class="btn btn-light btn-sm btn-svg-icon wishlist__column--remove--btn" data-id="${val.product_id}">
                                        <svg width="12px" height="12px">
                                            <use xlink:href="${base_url}assets/client/images/sprite.svg#cross-12"></use>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                    `
                )
            })
        }
       
    }

    $(document).on('click', '.wishlist__column--remove--btn', function(e) {
        callRequest($('#user_id').val(), $(this).data('id'), $(this).closest('tr'))
    });

    function callRequest(user_id, product_id, tr) {
        
        if (!user_id) {
            var wishList = JSON.parse(window.localStorage.wishList)
            $.each(wishList, function(index, val) {
                if (val.product_id == product_id) {
                    wishList[index] = null;
                    tr.remove();
                }
            });
            wishList = wishList.filter(function(val) {
                return val != null;
            });
            window.localStorage.wishList = JSON.stringify(wishList);

            return;
        }
        $.ajax({
            url: '/update-wish-list',
            type: 'POST',
            dataType: 'json',   
            data: { user_id, product_id},
        })
        .done(function(response) {
            tr.remove();   
        })
        .fail(function(e) {
        })
        .always(function() {
        });
    }
})