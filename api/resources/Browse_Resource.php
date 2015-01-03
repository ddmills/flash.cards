<?php
class Browse_Resource extends Rest_Resource {
  /* READ */
  public function resource_get($request) {
    $con     = new mywrap_con();
    $results = $con->run('select deck_id, name, description, created from decks where public = 1 order by deck_id DESC limit 10');
    $decks   = array();
    while ($result = $results->fetch_array()) {
      array_push($decks, $result);
    }
    $con->close();
    return $decks;
  }
} ?>