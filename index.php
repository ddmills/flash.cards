<?php require_once 'src/php/User_Manager.php'; ?>
<?php require_once 'src/php/lib/mysqli-wrapper/mywrap.php'; ?>
<?php $con  = new mywrap_con(); ?>
<?php $uman = new User_Manager($con); ?>
<?php session_start(); ?>
<!doctype html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta name='description' content='free flashcard application' http-equiv='X-UA-Compatible'>
  <meta content='width=device-width, initial-scale=1' name='viewport'>
  <title> Brain Cards &middot; Create Quick and Easy Flashcards </title>
  <link sizes='16x16, 32x32, 64x64' type='image/x-icon' rel='icon' href='favicon.ico?v=1'></link>
</head>
<body>

  <!-- NAVBAR CONTAINER -->
  <div id='navbar-container'></div>

  <!-- MAIN CONTENT (populated by router views) -->
  <div id='main-content'></div>

  <!-- MAIN MODALS (populated by bootstrap modals) -->
  <div id='main-modals'></div>

  <div class='container'>
    <br />
    <p><strong> H3110 W0R1D </strong></p>
    <pre><?php
    $current = $uman->current();
    if ($current) {
      echo $current->json(true);
    }
    ?></pre>
  </div>

  <!-- STYLES -->
  <link rel='stylesheet' href='src/css/font-awesome.min.css'></link>
  <link rel='stylesheet' href='src/css/main.css'></link>

  <!-- VENDOR SCRIPTS -->
  <script src='src/js/lib/jquery.min.js'></script>
  <script src='src/js/lib/underscore.min.js'></script>

  <!-- FONTS -->
  <link href='http://fonts.googleapis.com/css?family=Roboto:400,700,500,400italic' rel='stylesheet' type='text/css'>

</body>
</html>