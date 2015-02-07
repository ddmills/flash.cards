<?php require_once 'src/php/User_Manager.php'; ?>
<?php require_once 'src/php/lib/mysqli-wrapper/mywrap.php'; ?>
<?php $con  = new mywrap_con(); ?>
<?php $uman = new User_Manager($con); ?>
<?php session_start(); ?>
<?php $active = isset($active) ? $active : 'undefined'; ?>
<!doctype html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta name='description' content='free flashcard application' http-equiv='X-UA-Compatible'>
  <meta content='width=device-width, initial-scale=1' name='viewport'>
  <title> Flash Cards &middot; Create Quick and Easy Flashcards </title>
  <link sizes='16x16, 32x32, 64x64' type='image/x-icon' rel='icon' href='favicon.ico?v=1'></link>
</head>
<body>
  <header class='page-header'>
    <div class='container'>
      <a class='nav-item brand' href='/' title='homepage'>
        flash.cards
      </a>
      <nav>
        <a class='nav-item <?php echo $active == 'create' ? "active" : ''; ?>' href='/create'>
          Create a Deck
        </a>
        <a class='nav-item <?php echo $active == 'browse' ? "active" : ''; ?>' href='#'>
          Browse Decks
        </a>
        <a class='nav-item <?php echo $active == 'local' ? "active" : ''; ?>' href='#'>
          My Decks
        </a>
      </nav>
    </div>
  </header>
  <div class='page-content'>