<?php
class Deck_Resource extends Rest_Resource {
  /* READ */
  public function resource_get($request) {
    $deck_id = $request->inputs->requires('deck_id', 'uri');
    $con     = new mywrap_con();
    $results = $con->run('select name, owner, description, deck_id from decks where deck_id = ? limit 1', 'i', $deck_id);
    $deck    = $results->fetch_array();

    if ($deck) { return $deck; }
    throw new Exception('Deck with given id not found', 404);
  }

  /* UPDATE */
  public function resource_put($request) {
    $deck_id     = $request->inputs->requires('deck_id', 'uri');
    $name        = $request->inputs->requires('name', 'body');
    $description = $request->inputs->requires('description', 'body');

    $con  = new mywrap_con();
    $uman = new User_Manager($con);
    $user = $uman->current();
    $deck = Flash_Utils::get_deck($con, $deck_id);

    if ($deck) {
      if ($deck['owner']) {
        if ($user) {
          if ($deck['owner'] == $user->user_id) {
            $con->run('
              update decks
              set
                name = ?,
                description = ?
              where
                deck_id = ?
                and owner = ?',
              'ssii',
              array($name, $description, $deck_id, $user->user_id));

            return array(
              'deck_id'     => $deck_id,
              'name'        => $name,
              'owner'       => $user->user_id,
              'description' => $description
            );
          } else {
            throw new Exception('This deck does not belong to the user who is currently logged in.', 401);
          }
        } else {
          throw new Exception('You must be logged in to edit this deck.', 401);
        }
      } else {
        /* This deck is unowned - require a private key */
        $private_key = $request->inputs->requires('private_key', 'query');

        if ($user) {
          $owner = $user->user_id;
          $con->run('
            update decks
            set
              name = ?,
              description = ?,
              owner = ?
            where
              deck_id = ?
              and private_key = ?',
            'ssiis',
            array($name, $description, $owner, $deck_id, $private_key));
        } else {
          $owner = null;
          $con->run('
            update decks
            set
              name = ?,
              description = ?
            where
              deck_id = ?
              and private_key = ?',
            'ssis',
            array($name, $description, $deck_id, $private_key));
        }

        return array(
          'deck_id'     => $deck_id,
          'name'        => $name,
          'owner'       => $owner,
          'description' => $description
        );
      }
    } else {
      throw new Exception('Deck not found - bad deck_id provided', 400);
    }
  }

  /* DELETE */
  public function resource_delete($request) {
    $con         = new mywrap_con();
    $uman        = new User_Manager($con);
    $deck_id     = $request->inputs->requires('deck_id', 'uri');
    $private_key = $request->inputs->requires('private_key', 'query');
    $user        = $uman->current();
    $deck        = Flash_Utils::get_deck($con, $deck_id);

    if ($deck['owner']) {
      if ($user) {
        if (Flash_Utils::verify_owner($con, $deck_id, $user->user_id)) {
          $con->run('
            delete from decks
            where deck_id = ?
            and owner = ?
            limit 1', 'is',
            array($deck_id, $user->user_id));
          return true;
        } else{
          throw new Exception('You must own this deck to delete it', 401);
        }
      } else {
        throw new Exception('You must be logged in to delete this deck', 401);
      }
    } else {
      $private_key = $request->inputs->requires('private_key', 'query');
      $con->run('
        delete from decks
        where deck_id = ?
        and private_key = ?
        limit 1', 'is',
        array($deck_id, $private_key));
    }
  }
}
?>