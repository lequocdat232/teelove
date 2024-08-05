$(document).ready(function() {
    if (!$('#user_id').val()) {
        let cart = JSON.parse(window.localStorage.cart)
        cart = cart.filter(function(val) {
            return val != null
        });
        window.localStorage.cart = JSON.stringify(cart)
        let id = cart.map(function (item) {
            return item.product_id
        })
        $.ajax({
            url: '/product-add-to-cart',
            type: 'POST',
            dataType: 'json',
            data: {id: id},
        })
        .done(function(response) {
            cart = cart.map(function (item) {
                let p = {}
                $.each(response, function(index, val) {
                    if (val.id == item.product_id) {
                        p = val
                    }
                });
                return {
                    product_id: item.product_id,
                    qty: item.qty,
                    product: p,
                }
            })
            let totalMoney = 0;
            $.each(cart, function(index, val) {
                totalMoney += val.product.price * val.qty
                $('#cart-data').append(
                `<tr class="cart-table__row">
                    <td class="cart-table__column cart-table__column--image">
                        <a href=""><img src="${val.product.url}" alt=""></a>
                    </td>
                    <td class="cart-table__column cart-table__column--product">
                        <a href="" class="cart-table__product-name">${val.product.lot_name}</a>
                        <ul class="cart-table__options">
                            <li>${val.product.attr_value}</li>
                        </ul>
                    </td>
                    <td class="cart-table__column cart-table__column--price" data-title="Price">
                        $${(+val.product.price).toLocaleString()}
                    </td>
                    <td class="cart-table__column cart-table__column--quantity" data-title="Quantity">
                        <div class="input-number">
                            <input class="form-control input-number__input" type="number" min="1" value="${val.qty}" data-id="${val.product_id}">
                            <div class="input-number__add" data-id="${val.product_id}"></div>
                            <div class="input-number__sub" data-id="${val.product_id}"></div>
                        </div>
                    </td>
                    <td class="cart-table__column cart-table__column--total ${index}" data-title="Total">
                        $${(+val.product.price * +val.qty).toLocaleString()}
                    </td>
                    <td class="cart-table__column cart-table__column--remove">
                        <button type="button" class="btn btn-light btn-sm btn-svg-icon cart-table__column--remove--btn" data-id="${val.product_id}">
                            <svg width="12px" height="12px">
                                <use xlink:href="/assets/client/images/sprite.svg#cross-12"></use>
                            </svg>
                        </button>
                    </td>
                </tr>`
                )
            });
            $("#cart-total").text('$' + totalMoney.toLocaleString())
        })
    }
    // $(document).on('click', '.input-number__add', function(e) {
    //     callRequest($('#user_id').val(), $(this).data('id'), $(this).parent().children('input').val(), $(this).closest('tr'))
    // });

    // $(document).on('click', '.input-number__sub', function(e) {
    //     callRequest($('#user_id').val(), $(this).data('id'), $(this).parent().children('input').val(), $(this).closest('tr'))
    // });

    $(document).on('change', '.input-number__input', function(e) {
        callRequest($('#user_id').val(), $(this).data('id'), $(this).val(), $(this).closest('tr'))
    });

    $(document).on('click', '.cart-table__column--remove--btn', function(e) {
        callRequest($('#user_id').val(), $(this).data('id'), 0, $(this).closest('tr'))
    });

    function callRequest(user_id, product_id, qty, tr) {
        if (!user_id) {
            // console.log('update localstorage', user_id, product_id, qty, tr);
            var cart = JSON.parse(window.localStorage.cart)
            if (qty == 0) {
                tr.remove();
            }
            var totalMoney = 0;
            $.each(cart, function(index, val) {
                if (val.product_id == product_id) {
                    if (qty == 0) {
                        console.log('remove');
                        cart[index] = null
                    } else {
                        cart[index].qty = +qty
                        // var total = val.product.price * val.qty
                        // tr.children('td.cart-table__column--total').text('$' + total.toLocaleString());
                    }
                }
                // totalMoney += val.product.price * val.qty
            });
            cart = cart.filter(function(val) {
                console.log(val);
                return val != null;
            });
            console.log(cart, 'aaaa');
            let id = cart.map(function (item) {
                return item.product_id
            })
            $.ajax({
                url: '/product-add-to-cart',
                type: 'POST',
                dataType: 'json',
                data: {id: id},
            })
            .done(function(response) {
                cart = cart.map(function (item) {
                    let p = {}
                    $.each(response, function(index, val) {
                        if (val.id == item.product_id) {
                            p = val
                        }
                    });
                    return {
                        product_id: item.product_id,
                        qty: item.qty,
                        product: p,
                    }
                })
                let totalMoney = 0;
                $.each(cart, function(index, val) {
                    if (val.product_id == product_id) {
                        let total = val.product.price * val.qty
                        tr.children('td.cart-table__column--total').text('$' + total.toLocaleString());
                    }
                    totalMoney += val.product.price * val.qty
                })
                // console.log(totalMoney, 'totalMoneytotalMoney');
                $("#cart-total").text('$' + totalMoney.toLocaleString())
                window.localStorage.cart = JSON.stringify(cart)
                updateCartHeader(cart)
            })

            return
        }
        $.ajax({
            url: '/update-cart',
            type: 'POST',
            dataType: 'json',
            data: { user_id, product_id, qty },
        })
        .done(function(response) {
            if (qty == 0) {
                tr.remove();
            }
            updateCartHeader(response.cart_data)
            var totalMoney = 0;
            $.each(response.cart_data, function(index, val) {
                if (val.product_id == product_id) {
                    var total = val.product.price * val.qty
                    tr.children('td.cart-table__column--total').text('$' + total.toLocaleString());
                }
                totalMoney += val.product.price * val.qty
            });
            
            $("#cart-total").text('$' + totalMoney.toLocaleString())
        })
        .fail(function(e) {
        })
        .always(function() {
        });
    }
});
