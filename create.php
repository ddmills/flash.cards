<?php $active = 'create'; ?>
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

    <hr></hr>

    <div class='form-group form-group-radio'>
      <label>
        <input type='radio' name='public' value='1' checked>
        <i class='fa fa-fw fa-unlock'></i> Public<br />
        <span class='form-help'>
          Anyone can view this deck.
        </span>
      </label>
      <label>
        <input type='radio' name='public' value='0' disabled>
        <i class='fa fa-fw fa-lock'></i> Private<br />
        <span class='form-help'>
          You choose who can view or edit this deck. Currently unavailable.
        </span>
      </label>
    </div>

    <hr></hr>

    <button id='submit-create-deck' type='button' class='btn btn-success'>Create</button>

  </form>
</div>
<?php include_once 'src/php/parts/footer.php'; ?>