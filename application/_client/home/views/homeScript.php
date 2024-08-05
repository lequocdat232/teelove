<script>

$(document).ready(function () {
    
    $(`div.pro-sq-item`).hover(function () {
            $(this).find(`.flag-free-ship`).hide()
            $(this).find(`.btn-add-cart`).show()
            $(this).removeClass('p-3').addClass('p-2')
        }, function () {
            $(this).find(`.flag-free-ship`).show()
            $(this).find(`.btn-add-cart`).hide()
            $(this).removeClass('p-2').addClass('p-3')
        }
    );

});

</script>