$(document).on('click', '.select-type', function(e) {
    var name = $(this).attr('name');
    var value = $(this).val();
    var search = window.location.search.substring(1);
    if (search) {
        search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
    } else {
        search = {}
    }
    if (search[name] != value) {
        search[name] = value
        var str = "";
        for (var key in search) {
            if (str != "") {
                str += "&";
            }
            str += key + "=" + encodeURIComponent(search[key]);
        }
        window.location.href = window.location.origin + window.location.pathname + '?' + str
        return
    }
});

// add to cart
$(document).on('click', '.product__actions-item--addtocart', function(e) {
    var product_id = $(this).data('id')
    console.log(product_id, 'product_id');
    var qty = +($('#product-quantity').val())
    if (!$('#user_id').val()) {
        let cart = []
        if (window.localStorage.cart) {
            cart = JSON.parse(window.localStorage.cart)
        }
        if (cart.length === 0) {
            cart.push({
                product_id,
                qty,
            })
        } else {
            var isExist = false
            $.each(cart, function(index, val) {
                if (val && val.product_id == product_id && cart[index]) {
                    cart[index].qty += qty
                    isExist = true
                }
            });
            if (!isExist) {
                cart.push({
                    product_id,
                    qty,
                })
            }
        }
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
            updateCartHeader(cart)
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
        
        // $.ajax({
        //     url: '/product-add-to-cart',
        //     type: 'POST',
        //     dataType: 'json',
        //     data: {
        //         id: product_id
        //     }
        // })
        // .done(function(response) {
        //     console.log(response);
        //     let cart = []
        //     if (window.localStorage.cart) {
        //         cart = JSON.parse(window.localStorage.cart)
        //     }
        //     if (cart.length === 0) {
        //         cart.push({
        //             product_id,
        //             qty,
        //             product: response
        //         })
        //     } else {
        //         var isExist = false
        //         $.each(cart, function(index, val) {
        //             if (val && val.product_id == product_id && cart[index]) {
        //                 console.log(1);
        //                 cart[index].qty += qty
        //                 isExist = true
        //             }
        //         });
        //         if (!isExist) {
        //             console.log(2);
        //             cart.push({
        //                 product_id,
        //                 qty,
        //                 product: response
        //             })
        //         }
        //     }
        //     cart = cart.filter(function(val) {
        //         return val != null
        //     });
        //     window.localStorage.cart = JSON.stringify(cart)
        //     updateCartHeader(cart)
        // })
        // .fail(function() {
        //     console.log("error");
        // })
        // .always(function() {
        //     console.log("complete");
        // });
        
        return;
    }
    $.ajax({
        url: '/add-to-cart',
        type: 'POST',
        dataType: 'json',
        data: {
            user_id: $('#user_id').val(), 
            product_id,
            qty
        },
    })
    .done(function(response) {
        // indicator__value
        var total = 0;
        // console.log(response, 'responseresponse');
        updateCartHeader(response.cart_data)
        
        $.each(response.cart_data, function(index, val) {
            total += +val.qty
        });
        $("#indicator__value").text(total.toLocaleString())
        $("#indicator__value--mobi").text(total.toLocaleString())
    })
    .fail(function() {
    })
    .always(function() {
    });
});

$(document).on('click', '.product__actions-item--wishlist', function(e) {
    var product_id = $(this).data('id')
    // console.log($('#user_id').val());
    if (!$('#user_id').val()) {
        // console.log('no user_id');
        $.ajax({
            url: '/info-product-add-wish-list',
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
            console.log("Error!!!");
        })
        .always(function() {
            console.log("Complete!!!");
        })
    }
    else{
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
