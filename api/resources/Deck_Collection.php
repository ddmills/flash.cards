<?php
class Deck_Collection extends Rest_Resource {
    /* CREATE */
    public function resource_post($request) {
        /* get inputs called "name" and "cards" */
        $name        = $request->inputs->requires('name');
        $description = $request->inputs->requires('description');

        $key = '';

        $strong = false;

        if (function_exists('openssl_random_pseudo_bytes')) {
            $key = strtr(base64_encode(openssl_random_pseudo_bytes(64, $strong)), '+/=', '---');
            if ($strong == true) { $key = substr($key, 0, 64); }
        }

        if ($strong == false) {
            $characters = '0123456789';
            $characters .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-';
            $characters_len = strlen($characters)-1;
            for ($i = 0; $i < 64; $i++) {
                $key .= $characters[mt_rand(0, $characters_len)];
            }
        }

        $con = new Connection();

        $con->run('insert into decks
            (private_key, name, description)
            values (?, ?, ?)',
            'sss', array($key, $name, $description));

        $deck_id = $con->last_id();

        $results = $con->run('select * from decks where deck_id = ? limit 1', 'i', $deck_id);
        $deck = $results->fetch_array();

        return $deck;
    }

    /* READ */
    public function resource_get($request) {
        /* retrieve given list of decks, otherwise retrieve last 10 */
        $deck_ids = explode(',', $request->inputs->requires('deck_ids'));
        $count    = count($deck_ids);
        $con      = new Connection();

        if ($count) {
            $sql    = 'select name, description, deck_id from decks where';
            $types  = '';

            for ($i = 0; $i < $count; $i++) {
                $sql   .= ($i == 0) ? ' deck_id = ?' : ' or deck_id = ?';
                $types .= 'i';
            }

            $results  = $con->run($sql, $types, $deck_ids);

            $decks    = array();
            while($result = $results->fetch_array()) {
                array_push($decks, $result);
            }
            return $decks;

        }
        throw new Exception('Ids not provided', 404);
    }

    /* UPDATE */
    public function resource_put($request) {
        $con = new Connection();

        /* requires all four inputs to edit a deck */
        $name        = $request->inputs->requires('name', 'body');
        $description = $request->inputs->requires('description', 'body');
        $private_key = $request->inputs->requires('private_key', 'query');
        $deck_id     = $request->inputs->requires('deck_id', 'uri');

        $results = $con->run('select * from decks where deck_id = ? and private_key = ? limit 1', 'is', array($deck_id, $private_key));
        $deck    = $results->fetch_array();

        if ($deck) {
            $con->run('update decks set name = ?, description = ? where deck_id = ?', 'sss', array($name, $description, $deck_id));
        } else {
            throw new Exception('Deck not found - bad private_key or deck_id provided', 400);
        }

        return array(
            'deck_id'     => $deck_id,
            'name'        => $name,
            'description' => $description
        );
    }

    /* DELETE */
    public function resource_delete($request) {
        $con         = new Connection();
        $deck_id     = $request->inputs->requires('deck_id', 'uri');
        $private_key = $request->inputs->requires('private_key', 'query');
        $con->run('delete from decks where deck_id = ? and private_key = ? limit 1', 'is', array($deck_id, $private_key));
    }
}
?>
