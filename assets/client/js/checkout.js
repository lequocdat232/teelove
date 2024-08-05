$(document).ready(function() {
    
    var subTotal = +$('#checkout-sub-total').data('value');
    var shippingRate = 0;
    var checkoutTotal = 0;
    var couponAmount = 0;
    var couponType = '';
    var checkoutAfterFeeShip = 0;
    var isSameAddress = true;

    // A reference to Stripe.js
    var stripe;
    // Disable the button until we have Stripe set up on the page\
    function stripPayment(orderData) {
        document.querySelector("button").disabled = true;

        $.ajax({
            url: '/checkout/create-payment-intent',
            type: 'POST',
            data: orderData,
            dataType: 'json',
        })
        .done(function(data) {
            // console.log('aa', data)
            var res = setupElements(data);
            var stripe = res.stripe
            var card = res.card
            var clientSecret = res.clientSecret
            document.querySelector("button").disabled = false;

            // Handle form submission.
            var form = document.getElementById("payment-form");
            form.addEventListener("submit", function(event) {
                event.preventDefault();
                // submit ttoserver 
                // Initiate payment when the submit button is clicked
                pay(stripe, card, clientSecret);
            });
        });

        // Set up Stripe.js and Elements to use in checkout form
        var setupElements = function(data) {
            stripe = Stripe(data.publishableKey);
            var elements = stripe.elements();
            var style = {
                base: {
                    color: "#32325d",
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: "antialiased",
                    fontSize: "16px",
                    "::placeholder": {
                        color: "#aab7c4"
                    }
                },
                invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a"
                }
            };

            var card = elements.create("card", {
                style: style
            });
            card.mount("#card-element");

            return {
                stripe: stripe,
                card: card,
                clientSecret: data.clientSecret
            };
        };

        /*
        * Calls stripe.confirmCardPayment which creates a pop-up modal to
        * prompt the user to enter extra authentication details without leaving your page
        */
        var pay = function(stripe, card, clientSecret) {
            changeLoadingState(true);


            // Initiate the payment.
            // If authentication is required, confirmCardPayment will automatically display a modal
            stripe
                .confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: card
                    }
                })
                .then(function(result) {
                    if (result.error) {
                        // Show error to your customer
                        showError(result.error.message);
                    } else {
                        // The payment has been processed!
                        orderComplete(clientSecret);
                    }
                });
        };

        /* ------- Post-payment helpers ------- */

        /* Shows a success / error message when the payment is complete */
        var orderComplete = function(clientSecret) {
            // Just for the purpose of the sample, show the PaymentIntent response object
            stripe.retrievePaymentIntent(clientSecret).then(function(result) {
                var paymentIntent = result.paymentIntent;
                var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

                document.querySelector(".sr-payment-form").classList.add("hidden");
                document.querySelector("pre").textContent = paymentIntentJson;

                document.querySelector(".sr-result").classList.remove("hidden");
                setTimeout(function() {
                    document.querySelector(".sr-result").classList.add("expand");
                }, 200);
                // console.log(paymentIntent['id']); viết api gửi cái id này lên để trả kết quả zề rồi lưu lại trong DB
                $.ajax({
                    url: '/payment/save-payment-stripe',
                    type: 'POST',
                    data: {
                        id: paymentIntent['id'],
                    },
                    dataType: 'json',
                })
                .done(function(data) {
                    
                });
        
                changeLoadingState(false);
            });
        };

        var showError = function(errorMsgText) {
            changeLoadingState(false);
            var errorMsg = document.querySelector(".sr-field-error");
            errorMsg.textContent = errorMsgText;
            setTimeout(function() {
                errorMsg.textContent = "";
            }, 4000);
        };

        // Show a spinner on payment submission
        var changeLoadingState = function(isLoading) {
            if (isLoading) {
                document.querySelector("button").disabled = true;
                document.querySelector("#spinner").classList.remove("hidden");
                document.querySelector("#button-text").classList.add("hidden");
            } else {
                document.querySelector("button").disabled = false;
                document.querySelector("#spinner").classList.add("hidden");
                document.querySelector("#button-text").classList.remove("hidden");
            }
        };
    }; 

    function getTotalAfterCoupon() {
        switch (couponType) {
            case '%':
                return ((subTotal * ((100 - couponAmount) / 100)) + shippingRate).toFixed(2)
                break;
            case '$':
                return ((subTotal - couponAmount) + shippingRate).toFixed(2)
                break;
            default:
                return (subTotal + shippingRate).toFixed(2)
                break;
        }
    }


    /**
     *  STEP 1: checkout/infomation     Submit information form
     */
    $('#infor-submit').click(function() {
        var data = {}
        if (!$('#user_id').val()) {
            $('#guest-address').serializeArray().map(function(x){data[x.name] = x.value;})
            var isValidate = validateInfo(data)
            console.log(isValidate, 'isValidate');
            if (isValidate) {
                return
            }
            var email = data['checkout-email']
            // check email exist
            $.ajax({
                url: '/user/check-exist',
                type: 'POST',
                dataType: 'json',
                data: {name: 'email', value: email},
            })
            .done(function(response) {
                if (response) {    
                    $('#checkout-email').addClass('is-invalid');
                    $('#checkout-email-error').text('Email is already exist')
                    return
                }
                $('#checkout-email').removeClass('is-invalid');
                $('#checkout-email-error').text('');
                window.localStorage.dataInfo = JSON.stringify(data)
                window.location.href = '/checkout/shipping'
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
        } else {
            window.location.href = '/checkout/shipping'
        }
        
    })

    // validate information form
    function validateInfo(data) {
        var isValidate = false;
        if (!data['checkout-first-name']) {
            isValidate = true;
            console.log('checkout-first-name');
            $('#checkout-first-name').addClass('is-invalid');
            $('#checkout-first-name-error').text('First name is requied')
        } else {
            $('#checkout-first-name').removeClass('is-invalid');
            $('#checkout-first-name-error').text('')
        }
        if (!data['checkout-last-name']) {
            isValidate = true;
            console.log('checkout-last-name');
            $('#checkout-last-name').addClass('is-invalid');
            $('#checkout-last-name-error').text('Last name is requied')
        } else {
            $('#checkout-last-name').removeClass('is-invalid');
            $('#checkout-last-name-error').text('')
        }
        if (!data['checkout-email']) {
            console.log('checkout-email');
            isValidate = true;
            $('#checkout-email').addClass('is-invalid');
            $('#checkout-email-error').text('Email is requied')
        } else {
            $('#checkout-email').removeClass('is-invalid');
            $('#checkout-email-error').text('')
        }
        if (!data['checkout-address']) {
            isValidate = true;
            console.log('checkout-address');
            $('#checkout-address').addClass('is-invalid');
            $('#checkout-address-error').text('Address is requied')
        } else {
            $('#checkout-address').removeClass('is-invalid');
            $('#checkout-address-error').text('')
        }
        if (!data['checkout-city']) {
            isValidate = true;
            console.log('checkout-city');
            $('#checkout-city').addClass('is-invalid');
            $('#checkout-city-error').text('City is requied')
        } else {
            $('#checkout-city').removeClass('is-invalid');
            $('#checkout-city-error').text('')
        }
        if (!data['checkout-postcode']) {
            isValidate = true;
            console.log('checkout-postcode');
            $('#checkout-postcode').addClass('is-invalid');
            $('#checkout-postcode-error').text('Postcode is requied')
        } else {
            $('#checkout-postcode').removeClass('is-invalid');
            $('#checkout-postcode-error').text('')
        }
        if (!data['checkout-country']) {
            isValidate = true;
            console.log('checkout-country');
            $('#checkout-country').addClass('is-invalid');
            $('#checkout-country-error').text('Country is requied')
        } else {
            $('#checkout-country').removeClass('is-invalid');
            $('#checkout-country-error').text('')
        }
        return isValidate
    }
    /**
     * init for checkout information page
     */
    if (document.getElementById('checkout-information-page')) {
        var info = window.localStorage.dataInfo
        window.localStorage.removeItem('dataInfo')
        if (info) {
            info = JSON.parse(info)
            $('#checkout-email').val(info['checkout-email'])
            $('#checkout-first-name').val(info['checkout-first-name'])
            $('#checkout-last-name').val(info['checkout-last-name'])
            $('#checkout-address').val(info['checkout-address'])
            $('#checkout-city').val(info['checkout-city'])
            $('#checkout-country').val(info['checkout-country']).change()
            $('#checkout-postcode').val(info['checkout-postcode'])
        }
    }
    /**
     * get cart from localstorage if not logged in
     */
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
            var totalMoney = 0;
            $.each(cart, function(index, val) {
                totalMoney += val.product.price * val.qty
                var html = `
                    <tr>
                        <td>
                            ${val.product.lot_name} x ${val.qty}
                            <ul class="cart-table__options">
                `
                $.each(val.product.attr, function (i, attr) {
                    html += `<li>${attr.name_text}: ${attr.attr_value}</li>`
                })
                html += `
                            </ul>
                        </td>
                        <td>$${(+val.product.price * +val.qty).toLocaleString()}</td>
                    </tr>
                `
                $('#checkout__totals-products').append(html)
            });
            subTotal = totalMoney
            checkoutTotal = getTotalAfterCoupon();
            $('#checkout-sub-total').text(new Number(totalMoney).toLocaleString())
            $('#checkout-total').text(new Number(checkoutTotal).toLocaleString())
            $('#checkout-total').data('value', checkoutTotal)
        })
    } else {
        
    }

    /**
     * get coupon from localStorage
     */
    if (window.localStorage.coupon) {
        $('#coupon').val(window.localStorage.coupon)
        requestCoupon(window.localStorage.coupon)
    }

    /**
     * get country shipping rate
     */
    $("#checkout-country").change(function(event) {
        $.ajax({
            url: '/shippping-rate',
            type: 'POST',
            data: {
                code: $(this).val()
            },
            dataType: 'json',
        })
        .done(function(response) {
            shippingRate = +response.price_base
            checkoutTotal = getTotalAfterCoupon();
            $('#shipping-rate').text(new Number(shippingRate).toLocaleString())
            $('#checkout-total').text(new Number(checkoutTotal).toLocaleString())
            $('#checkout-total').data('value', checkoutTotal)
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
    });

    /**
     * get coupon
     */
    $("#get-coupon").click(function(event) {
        var coupon = $('#coupon').val()
        if (coupon) {
            requestCoupon(coupon, true)
        }
    });

    function requestCoupon(coupon, isSaveCoupon = false) {
        $.ajax({
            url: '/coupon',
            type: 'POST',
            data: {
                coupon
            },
            dataType: 'json',
        })
        .done(function(response) {
            couponAmount = +response.amount
            couponType = response.type
            checkoutTotal = getTotalAfterCoupon();
            $('#checkout-discount-result').show();
            $('#checkout-discount-result span').text(response.type + new Number(response.amount).toLocaleString());
            $('#checkout-total').text(new Number(checkoutTotal).toLocaleString())
            $('#checkout-total').data('value', checkoutTotal)
            if (isSaveCoupon) {
                window.localStorage.coupon = coupon
            }
        })
        .fail(function(e) {
            $('#checkout-discount-result').hide();
            alert(e.responseJSON.message)
            couponAmount = 0
            couponType = ''
            checkoutTotal = getTotalAfterCoupon();
            $('#checkout-total').text(new Number(checkoutTotal).toLocaleString())
            $('#checkout-total').data('value', checkoutTotal)
        })
        .always(function() {
            console.log("complete");
        });
    }
    
    /**
     * select address shipping when Login 
     */
    $(".select-address").click(function() {
        $(".select_address--active").removeClass("select_address--active");
        $(this).addClass("select_address--active");
        $('#shipping-pack__list').empty();
        let address      = $(this).data("address");
        let country_code = address['country_code'];
        let city         = address['city'];
        let zip          = address['zip'];
        var data = {
            'checkout-first-name' : address['first_name'],
            'checkout-last-name' : address['last_name'],
            'checkout-email'   : address['email'],
            'checkout-address' : address['address'],
            'checkout-city'    : address['city'],
            'checkout-country' : address['country_code'],
            'checkout-postcode': address['zip']
        }
        console.log(data);
        localStorage.setItem('dataInfo', JSON.stringify(data)); 
    })

    /**
     * STEP 2: checkout/shipping
     */
    /**
     * init for checkout shipping page
     */
    if ($('#checkout-shipping-page')) {
        var info = JSON.parse(window.localStorage.dataInfo)
        $('#info-email').text(info['checkout-email'])
        $('#info-address').text(info['checkout-address'] + ', ' + info['checkout-city'] + ', ' + info['checkout-country'])
        var data = info;
        // $('#guest-address').serializeArray().map(function(x){data[x.name] = x.value;})
        $('#shipping-pack__list').empty();
        let country_code = data['checkout-country']
        let city         = data['checkout-city'];
        let zip          = data['checkout-postcode'];
        let state        = data['checkout-state'];
        $.ajax({
            url: '/shipping-pack',
            type: 'POST',
            data: {
                country_code: country_code,
                city: city,
                zip: parseInt(zip),
                state: state
            },
            dataType: 'json',
        })
        .done(function(response) {
            if (response) {
                var localRate = window.localStorage.shipping
                if (localRate) {
                    var flag = true
                    $.each(response, function(index, val) {
                        console.log(index, val);
                        if (index == JSON.parse(localRate).index && val.price_base == JSON.parse(localRate).value.price_base) {
                            flag = false
                        }
                    })
                    if (flag) {
                        localRate = null
                    }
                }
                $.each(response, function(index, val) {
                    if (index == (localRate ? JSON.parse(localRate).index : 0)) {
                        shippingRate = +val.price_base
                        if (!localRate) {
                            window.localStorage.shipping = 0
                            window.localStorage.shipping = JSON.stringify({
                                index: 0,
                                value: val
                            })
                        }
                    }
                    $('#shipping-pack__list').append(`
                     <li class="payment-methods__item payment-methods__item--active shipping-pack__item">
                        <label class="payment-methods__item-header">
                            <span class="payment-methods__item-radio input-radio">
                                <span class="input-radio__body">
                                    <input class="input-radio__input" name="checkout_shipping_method" type="radio" ${index == (localRate ? JSON.parse(localRate).index : 0) ? 'checked="checked"' : ''} value="${val.price_base}" data-index="${index}" data-value='${JSON.stringify(val)}'>
                                    <span class="input-radio__circle"></span>
                                </span>
                            </span>
                            <span class="payment-methods__item-title"><strong>${val.price_base}$ ${val.pack}</strong></br><i style="color: #9b9b9b">(${val.description})</i></span>
                        </label>
                    </li>
                    `)
                });
                checkoutTotal = getTotalAfterCoupon();
                $('#sum-total-checkout').text(new Number(checkoutTotal).toLocaleString())
                $('#shipping-rate').text(new Number(shippingRate).toLocaleString())
                $('#checkout-total').text(new Number(checkoutTotal).toLocaleString())
                $('#checkout-total').data('value', checkoutTotal)
                $('#sum-total-checkout').text(new Number(checkoutTotal).toLocaleString() + ' $')
                let feeShiping = $('input[name=paypal_fee').val();
                checkoutAfterFeeShip = (parseFloat(checkoutTotal) + parseFloat((checkoutTotal*feeShiping/100))).toFixed(2);
                $("input[name=amount]").val(checkoutAfterFeeShip);
                $('#sum-total-via-paypal').text(new Number(checkoutAfterFeeShip).toLocaleString() + ' $')
                // if (localRate) {
                //     window.localStorage.removeItem('shipping')
                // }
            }
        })
    }
    /**
     * Select pack shipping
     */
    $(document).on('change', 'input[type=radio][name=checkout_shipping_method]', function() {
        shippingRate = +$(this).val()
        let index = $(this).data('index')
        let dataValue = $(this).data('value')
        // console.log(dataValue);
        window.localStorage.shipping = JSON.stringify({
            index,
            value: dataValue
        })
        checkoutTotal = getTotalAfterCoupon();
        $('#sum-total-checkout').text(new Number(checkoutTotal).toLocaleString())
        $('#shipping-rate').text(new Number(shippingRate).toLocaleString())
        $('#checkout-total').text(new Number(checkoutTotal).toLocaleString())
        $('#checkout-total').data('value', checkoutTotal)
        $('#sum-total-checkout').text(new Number(checkoutTotal).toLocaleString() + ' $')
        let feeShiping = $('input[name=paypal_fee').val();
        // console.log(feeShiping, 'feeShiping');
        checkoutAfterFeeShip = (parseFloat(checkoutTotal) + parseFloat((checkoutTotal*feeShiping/100))).toFixed(2);
        $("input[name=amount]").val(checkoutAfterFeeShip);
        $('#sum-total-via-paypal').text(new Number(checkoutAfterFeeShip).toLocaleString() + ' $')
    })
 
    /**
     * STEP 3: checkout/payment
    */
    /**
     * init for checkout payment page
     */
    if ($('#checkout-payment-page')) {
        var info = JSON.parse(window.localStorage.dataInfo)
        var shipping = JSON.parse(window.localStorage.shipping)
        $('#info-email').text(info['checkout-email'])
        $('#info-address').text(info['checkout-address'] + ', ' + info['checkout-city'] + ', ' + info['checkout-country'])
        $('#info-shipping').text(shipping.value.price_base + '$ ' + shipping.value.description)
    }
    /**
     * Select Payment Method
     */
    $("#payment-paypal").click(function(){
        $("#pay-now").text("Pay With PayPal");
    })

    /**
     * Select Card Method
     */
    $("#payment-stripe").click(function(){
        $("#pay-now").text("Pay With Card");
    })

    /**
     * check-billing-address 
     */
    $('#check-billing-address').click(function(){
        if($(this).is(':checked')){
            $('.billing-address').hide();
            isSameAddress = true
        } else {
            $('.billing-address').show();
            isSameAddress = false
        }
    });

    /**
     * get data billing address
     */
    function getBillAddress() {
        var shipAdd = {}
        if (!isSameAddress) {

            var shipData = {}
            $('#billing-address').serializeArray().map(function(x){shipData[x.name] = x.value;})
            shipData['checkout-email'] = 'skip'
            var isValidate = validateInfo(shipData)

            if (isValidate) {
                return
            }
            shipAdd = {
                'ship-email': shipData['checkout-email'],
                'ship-first-name': shipData['checkout-first-name'],
                'ship-last-name': shipData['checkout-last-name'],
                'ship-address': shipData['checkout-address'],
                'ship-city': shipData['checkout-city'],
                'ship-country': shipData['checkout-country'],
                'ship-postcode': shipData['checkout-postcode'],
            }
        } else {
            shipAdd = {
                'ship-email': data['checkout-email'],
                'ship-first-name': data['checkout-first-name'],
                'ship-last-name': data['checkout-last-name'],
                'ship-address': data['checkout-address'],
                'ship-city': data['checkout-city'],
                'ship-country': data['checkout-country'],
                'ship-postcode': data['checkout-postcode'],
            }
        }
        return shipAdd
    }
    
    /**
     * Pay Now
     */
    $("#pay-now").click(function(){
        let order_number = $("input[name=order_number]").val();
        // validate
        var method = $('input[name=payment_method]:checked').val()
        if (!method) {
            alert('chua chon phuong thuc thanh toan')
            return
        }
        var shipAdd = getBillAddress()
        var data = JSON.parse(window.localStorage.dataInfo)
        // if logged in
        if ($('#user_id').val()) {
            var cart = $('#checkout__totals-products').data('value')
            cart = cart.replace(/'/g, "\"").replace(/\\'/g, "'")
            cart = JSON.parse(cart)
            console.log('cart', cart);
            data = Object.assign(data, {
                order_number: order_number,
                sum_amount: $('#checkout-total').data('value'),
                order_sub: cart,
            })
            data = Object.assign(data, shipAdd)
            data.member_id = $('#user_id').val()
            console.log(data);
            // // validate
            // var method = $('input[name=payment_method]:checked').val()
            // if (!method) {
            //     alert('chua chon phuong thuc thanh toan')
            //     return
            // }
            // let order_sub = $(this).data('cart');
            // if($('#payment_with--paypal').prop('checked')){
            //     $('#modal_payment_auto_paypal').modal('show');
            //     $("#pay-now").text("Pay With PayPal");
            // }

            // if($('#payment_with--card').prop('checked')){
            // }

            $.ajax({
                url: '/create-order',
                type: 'POST',
                data
            })
            .done(function() {
                // clear data
                window.localStorage.removeItem('cart')
                window.localStorage.removeItem('shipping')
                window.localStorage.removeItem('dataInfo')
            })
        } else {
            // var order_sub = JSON.parse(window.localStorage.cart)
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
                let order_sub = cart.map(function (item) {
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
                data = Object.assign(data, {
                    order_number: order_number,
                    sum_amount: $('#checkout-total').data('value'),
                    order_sub: order_sub,
                })
                data = Object.assign(data, shipAdd)
                if($('#payment_with--stripe').prop('checked')){
                    $('#modal_payment_auto_stripe').modal('show');
                    var orderData = {
                        currency: "usd",
                        amount: data.sum_amount,
                        customer: 2110,
                        order_number: parseInt(data.order_number)
                    };
                    $('#sum-total-checkout-stripe').text(data.sum_amount + ' $');
                    
                    $.ajax({
                        url: '/create-order-without-member',
                        type: 'POST',
                        data
                    })
                    .done(function() {
                        // clear data
                        stripPayment(orderData)
                        window.localStorage.removeItem('cart')
                        window.localStorage.removeItem('shipping')
                        window.localStorage.removeItem('dataInfo')
                    })
                }
                
                if($('#payment_with--paypal').prop('checked')){
                    $('#modal_payment_auto_paypal').modal('show');
                    $('#payment-paypal-now').click(function() {
                        $.ajax({
                            url: '/create-order-without-member',
                            type: 'POST',
                            data
                        })
                        .done(function() {
                            // clear data
                            window.localStorage.removeItem('cart')
                            window.localStorage.removeItem('shipping')
                            window.localStorage.removeItem('dataInfo')
                        })
                    })
                }
            })
        }
    })

    
});
