<!doctype html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta name='description' content='free flashcard application' http-equiv='X-UA-Compatible'>
  <meta content='width=device-width, initial-scale=1' name='viewport'>
  <title> Quick Flashcards </title>
  <link sizes='16x16, 32x32, 64x64' type='image/x-icon' rel='icon' href='favicon.ico?v=1'></link>
</head>
<body>

  <?php
    include 'app/navbar.html';
    include 'app/templates/landing.html';
    include 'app/templates/create.html';
    include 'app/templates/restricted.html';
    include 'app/templates/edit.html';
    include 'app/templates/browse.html';
  ?>

  <!-- MAIN CONTENT (populated by router views) -->
  <div id='main-content'></div>

  <!-- MAIN MODALS (populated by bootstrap modals) -->
  <div id='main-modals'></div>

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
  <script src='app/app.local.js'></script>
  <script src='app/app.data.js'></script>
  <script src='app/views/landing.js'></script>
  <script src='app/views/create.js'></script>
  <script src='app/views/restricted.js'></script>
  <script src='app/views/edit.js'></script>
  <script src='app/views/browse.js'></script>
  <script src='app/app.router.js'></script>

</body>
</html>
