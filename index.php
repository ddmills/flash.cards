<?php require_once 'api/lib/User.php'; ?>
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

  <?php
    include 'app/templates/template.navbar.html';
    include 'app/templates/template.landing.html';
    include 'app/templates/template.create.html';
    include 'app/templates/template.restricted.html';
    include 'app/templates/template.edit.html';
    include 'app/templates/template.view.html';
    include 'app/templates/template.browse.html';
    include 'app/templates/template.deleted.html';
  ?>

  <!-- NAVBAR CONTAINER -->
  <div id='navbar-container'></div>

  <!-- MAIN CONTENT (populated by router views) -->
  <div id='main-content'></div>

  <!-- MAIN MODALS (populated by bootstrap modals) -->
  <div id='main-modals'></div>

  <div class='container'><pre><?php echo($_SESSION['user']->json(true)); ?></pre></div>

  <?php include 'app/footer.html'; ?>

  <!-- STYLES -->
  <link rel='stylesheet' href='assets/css/bootstrap.min.css'></link>
  <link rel='stylesheet' href='assets/css/font-awesome.min.css'></link>
  <link rel='stylesheet' href='app/main.css'></link>

  <!-- VENDOR SCRIPTS -->
  <script src='assets/js/jquery.min.js'></script>
  <script src='assets/js/underscore.min.js'></script>
  <script src='assets/js/backbone.min.js'></script>
  <script src='assets/js/backbone.model-binder.min.js'></script>
  <script src='assets/js/backbone.collection-binder.min.js'></script>
  <script src='assets/js/bootstrap.min.js'></script>

  <!-- APP SCRIPTS -->
  <script src='app/app.main.js'></script>
  <script src='app/app.user.js'></script>
  <script src='app/app.local.js'></script>
  <script src='app/app.data.js'></script>
  <script src='app/views/view.navbar.js'></script>
  <script src='app/views/view.landing.js'></script>
  <script src='app/views/view.create.js'></script>
  <script src='app/views/view.restricted.js'></script>
  <script src='app/views/view.edit.js'></script>
  <script src='app/views/view.browse.js'></script>
  <script src='app/views/view.deleted.js'></script>
  <script src='app/views/view.view.js'></script>
  <script src='app/app.router.js'></script>

  <!-- FONTS -->
  <link href='http://fonts.googleapis.com/css?family=Roboto:400,700,500,400italic' rel='stylesheet' type='text/css'>

</body>
</html>
