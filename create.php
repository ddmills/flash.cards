<?php $active = 'create'; ?>
<?php require_once 'src/php/User_Manager.php'; ?>
<?php require_once 'src/php/lib/mysqli-wrapper/mywrap.php'; ?>
<?php $con  = new mywrap_con(); ?>
<?php $uman = new User_Manager($con); ?>
<?php include_once 'src/php/parts/header.php'; ?>
<!-- page local header -->
<div class='local-header'>
  <div class='container'>
    <h1><i class='fa fa-fw fa-plus'></i> Create a new deck &hellip;</h1>
  </div>
</div>
<div class='container'>
  <form role='form' id='create-deck-form'>
    <div class='form-group'>
      <label for='create-deck-name'>Name <span class='form-help'>enter a name for your deck</span></label>
      <input id='create-deck-name' class='form-input' type='text' maxlength='32' name='name' placeholder='My Deck'>
      <span class='form-error'>Name is required</span>
    </div>

    <div class='form-group'>
      <label for='create-deck-description'>Description <span class='form-help'>(optional)</span></label>
      <input id='create-deck-description' class='form-input' type='text' maxlength='128' name='name' placeholder='Short description of this deck'>

    </div>

  </form>
</div>
<?php include_once 'src/php/parts/footer.php'; ?>