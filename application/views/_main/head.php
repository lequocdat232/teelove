<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no">
    <title><?=$title?></title>
    <!-- <link rel="icon" type="image/png" href="images/favicon.png"> -->

    <!-- fonts -->

    <!-- css -->
    <!-- <link rel="stylesheet" href="<?=base_url()?>assets/client/css/font.css"> -->
    <link rel="stylesheet" href="<?=base_url()?>assets/client/css/main.css">

    <!-- js -->

    <!-- TW -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- CSS only -->
    
    <!-- JS, Popper.js, and jQuery -->
    <script src="<?=base_url()?>assets/client/vendor/jquery-3.5.1.min.js" ></script>
    <!-- <script src="<?=base_url()?>assets/client/vendor/popper.min.js" ></script> -->

    <style>

    </style>

    <style>
        body{
        }
    </style>

    <style type="text/tailwindcss">
        @layer utilities {
            .content-auto {
                content-visibility: auto;
            }
        }
    </style>

    <script>
        tailwind.config = {
        theme: {
            extend: {
            colors: {
                clifford: '#da373d',
            }
            }
        }
        }
    </script>

</head>

<body class="h-full bg-white">
