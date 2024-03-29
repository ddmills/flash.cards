<?php
class Card_Resource extends Rest_Resource {
  /* READ */
  public function resource_get($request) {
    $con     = new mywrap_con();
    $deck_id = $request->inputs->requires('deck_id', 'uri');
    $card_id = $request->inputs->requires('card_id', 'uri');
    $card    = Flash_Utils::get_card($con, $deck_id, $card_id);
    if ($card) { return $card; }
    throw new Exception('Card not found', 404);
  }

  /* UPDATE */
  public function resource_put($request) {
    $deck_id = $request->inputs->requires('deck_id', 'uri');
    $card_id = $request->inputs->requires('card_id', 'uri');
    $front   = $request->inputs->requires('front', 'body');
    $back    = $request->inputs->requires('back', 'body');

    $con     = new mywrap_con();
    $uman    = new User_Manager($con);
    $user    = $uman->current();
    $deck    = Flash_Utils::get_deck($con, $deck_id);


    if (isset($deck['owner'])) {
      if ($user) {
        if (Flash_Utils::verify_owner($con, $deck_id, $user->user_id)) {
          $con->run('
            update cards
            set front = ?, back = ?
            where card_id = ?
            limit 1', 'ssi',
            array($front, $back, $card_id));
          return Flash_Utils::get_card($con, $deck_id, $card_id);
        } else {
          throw new Exception('This deck is not owned by the user who is currently logged in', 401);
        }
      } else {
        throw new Exception('You must be logged in to edit this deck', 401);
      }
    } else {
      $private_key = $request->inputs->requires('private_key', 'query');
      if (Flash_Utils::verify_key($con, $deck_id, $private_key)) {
        $con->run('
          update cards
          set front = ?, back = ?
          where card_id = ?
          limit 1', 'ssi',
          array($front, $back, $card_id));
        return Flash_Utils::get_card($con, $deck_id, $card_id);
      }
      throw new Exception('deck_id and private_key did not match', 400);
    }
  }

  /* DELETE */
  public function resource_delete($request) {
    $con         = new mywrap_con();
    $uman        = new User_Manager($con);
    $deck_id     = $request->inputs->requires('deck_id', 'uri');
    $card_id     = $request->inputs->requires('card_id', 'uri');
    $user        = $uman->current();
    $deck        = Flash_Utils::get_deck($con, $deck_id);

    if ($deck['owner']) {
      if ($user) {
        if (Flash_Utils::verify_owner($con, $deck_id, $user->user_id)) {
          $con->run('
            delete from cards
            where card_id = ?
            and deck_id = ?
            limit 1', 'is',
            array($card_id, $deck_id));
          return true;
        } else {
          throw new Exception('You must own this deck to delete this card', 401);
        }
      } else {
        throw new Exception('You must be logged in to delete this card', 401);
      }
    } else {
      $private_key = $request->inputs->requires('private_key', 'query');
      if (Flash_Utils::verify_key($con, $deck_id, $private_key)) {
        $con->run('
          delete from cards
          where card_id = ?
          and deck_id = ?
          limit 1', 'is',
          array($card_id, $deck_id));
        return true;
      }
      throw new Exception('deck_id and private_key did not match', 400);
    }


  }

} ?>