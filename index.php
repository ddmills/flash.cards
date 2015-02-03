<?php require_once 'src/php/User_Manager.php'; ?>
<?php require_once 'src/php/lib/mysqli-wrapper/mywrap.php'; ?>
<?php $con  = new mywrap_con(); ?>
<?php $uman = new User_Manager($con); ?>
<?php include_once 'src/php/parts/header.php'; ?>
<div class='container'>
  <div class='row'>
    <div class='col-3'>
      <img src='/src/img/splash.jpg' width='100%'>
    </div>
    <div class='col-9'>
      <h1> splash.cards! </h1>
      <p> Create study a deck of study cards and quiz yourself. Quick, easy, and free! No account necessary. </p>
      <a href='/create' class='btn btn-default btn-lg'> Create a deck now! </a>
    </div>
  </div>
</div>
<?php include_once 'src/php/parts/footer.php'; ?>