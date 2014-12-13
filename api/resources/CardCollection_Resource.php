<?php
class CardCollection_Resource extends Rest_Resource {
    private function verify_key($con, $deck_id, $private_key) {
        $results = $con->run('select * from decks where deck_id = ? and private_key = ? limit 1', 'is', array($deck_id, $private_key));
        return $results->fetch_array();
    }

    private function get_card($con, $card_id) {
        $results = $con->run('select * from cards where card_id = ? limit 1', 'i', $card_id);
        return $results->fetch_array();
    }

    /* UPDATE */
    public function resource_post($request) {
        $con         = new Connection();
        $deck_id     = $request->inputs->requires('deck_id', 'uri');
        $private_key = $request->inputs->requires('private_key', 'query');
        $front       = $request->inputs->requires('front', 'body');
        $back        = $request->inputs->requires('back', 'body');

        if ($this->verify_key($con, $deck_id, $private_key)) {
            $con->run('insert into cards (deck_id, front, back) values (?, ?, ?)', 'iss', array($deck_id, $front, $back));
            $card_id = $con->last_id();
            return $this->get_card($con, $card_id);
        }

        throw new Exception('deck_id and private_key did not match', 400);
    }

    /* READ */
    public function resource_get($request) {
        $con     = new Connection();
        $deck_id = $request->inputs->requires('deck_id', 'uri');
        $results = $con->run('select * from cards where deck_id = ?', 'i', $deck_id);
        $cards = array();
        while ($result = $results->fetch_array()) {
            array_push($cards, $result);
        }
        return $cards;
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
        $con         = new Connection();
        $deck_id     = $request->inputs->requires('deck_id', 'uri');
        $card_id     = $request->inputs->requires('card_id', 'uri');
        $private_key = $request->inputs->requires('private_key', 'query');
        if ($this->verify_key($con, $deck_id, $private_key)) {
            $con->run('delete from cards where card_id = ? and deck_id = ? limit 1', 'is', array($card_id, $deck_id));
            return $con->affected_rows > 0;
        }
        throw new Exception('deck_id and private_key did not match', 400);
    }

} ?>
