$(document).ready(function($) {
    $.getScript('http://www.geoplugin.net/javascript.gp', function() 
    {
        var country = geoplugin_countryName();
        var country_code = geoplugin_countryCode();
        var city = geoplugin_city();
        var time_zone = geoplugin_timezone();
        var currency_code = geoplugin_currencyCode();
        $(`#shipping-country option[value='${country_code}']`).prop('selected',true);
        $('#shipping-city').val(city);
    });

    $( ".order-summary-toggle" ).on( "click", function() {
        // $('.main-order-card').toggleClass("main-order-card-open",1000);
        $('.main-checkout-card').toggleClass("order-card-open");

        if ($(".main-order-card").height() == 0) {
            var heightnow=$(".main-order-card").height();
            var heightfull=$(".main-order-card").css({height:'auto'}).height();
            // $(".main-order-card").animate({height: heightfull},400);
            console.log(heightnow, 'heightnow2')
            console.log(heightfull, 'heightfull2')
            $(".main-order-card").css({height:heightnow}).animate({
                height: heightfull+15
            }, 500);
           $( ".main-order-card" ).css({
               'visibility' : 'visible',
            });

        }else if ($(".main-order-card").height() > 0) {

           $(".main-order-card").animate({height: "0px"},400);
           // setTimeout(
           //  $( ".main-order-card" ).css({
           //     'visibility' : 'hidden',
           //  }), 3000);
           
        }
        
    });

});

