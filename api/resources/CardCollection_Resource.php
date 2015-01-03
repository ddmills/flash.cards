<?php
class CardCollection_Resource extends Rest_Resource {
  /* UPDATE */
  public function resource_post($request) {
    $con         = new mywrap_con();
    $deck_id     = $request->inputs->requires('deck_id', 'uri');
    $private_key = $request->inputs->requires('private_key', 'query');
    $front       = $request->inputs->requires('front', 'body');
    $back        = $request->inputs->requires('back', 'body');

    if (Flash_Utils::verify_key($con, $deck_id, $private_key)) {
      $con->run('insert into cards (deck_id, front, back) values (?, ?, ?)', 'iss', array($deck_id, $front, $back));
      $card_id = $con->last_id();
      return Flash_Utils::get_card($con, $deck_id, $card_id);
    }

    throw new Exception('deck_id and private_key did not match', 400);
  }

  /* READ */
  public function resource_get($request) {
    $con     = new mywrap_con();
    $deck_id = $request->inputs->requires('deck_id', 'uri');
    $results = $con->run('select * from cards where deck_id = ?', 'i', $deck_id);
    $cards   = array();
    while ($result = $results->fetch_array()) {
      array_push($cards, $result);
    }
    return $cards;
  }
} ?>