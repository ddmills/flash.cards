<?php
class Card_Resource extends Rest_Resource {
  /* READ */
  public function resource_get($request) {
    $con     = new Connection();
    $deck_id = $request->inputs->requires('deck_id', 'uri');
    $card_id = $request->inputs->requires('card_id', 'uri');
    $card    = Flash_Utils::get_card($con, $deck_id, $card_id);
    if ($card) { return $card; }
    throw new Exception('card not found', 404);
  }

  /* UPDATE */
  public function resource_put($request) {
    $con         = new Connection();
    $deck_id     = $request->inputs->requires('deck_id', 'uri');
    $private_key = $request->inputs->requires('private_key', 'query');
    $card_id     = $request->inputs->requires('card_id', 'uri');
    $front       = $request->inputs->requires('front', 'body');
    $back        = $request->inputs->requires('back', 'body');

    if ($this->verify_key($con, $deck_id, $private_key)) {
      $con->run('update cards set front = ?, back = ? where card_id = ? limit 1', 'ssi', array($front, $back, $card_id));
      return $this->get_card($con, $card_id);
    }

    throw new Exception('deck_id and private_key did not match', 400);
  }

  /* DELETE */
  public function resource_delete($request) {
    $con       = new Connection();
    $deck_id   = $request->inputs->requires('deck_id', 'uri');
    $card_id   = $request->inputs->requires('card_id', 'uri');
    $private_key = $request->inputs->requires('private_key', 'query');
    if ($this->verify_key($con, $deck_id, $private_key)) {
      $con->run('delete from cards where card_id = ? and deck_id = ? limit 1', 'is', array($card_id, $deck_id));
      return $con->affected_rows > 0;
    }
    throw new Exception('deck_id and private_key did not match', 400);
  }

} ?>
