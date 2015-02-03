<?php require_once 'src/php/User_Manager.php'; ?>
<?php require_once 'src/php/lib/mysqli-wrapper/mywrap.php'; ?>
<?php $con  = new mywrap_con(); ?>
<?php $uman = new User_Manager($con); ?>
<?php include_once 'src/php/parts/header.php'; ?>
<div class='container'>
  <img class='pull-left' src='/src/img/splash.jpg' width='300px'>
  <h1> splash.cards! </h1>
  <p> Create study a deck of study cards and quiz yourself. Quick, easy, and free! No account necessary. </p>
</div>
<?php include_once 'src/php/parts/footer.php'; ?>