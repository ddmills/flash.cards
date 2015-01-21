<?php
class Flash_Utils {
  /*
   * Verify that a deck id matches a private key
   * @param Connection $con A mysqli-wrapper Connection object
   * @param int $deck_id the public Deck ID
   * @param string $private_key the private Deck key
   * @return Array|False Deck returns the deck array, or false if keys don't match
   */
  public static function verify_key($con, $deck_id, $private_key) {
    $results = $con->run('
      select * from decks
      where deck_id = ? and private_key = ?
      limit 1', 'is',
      array($deck_id, $private_key));
    return $results->fetch_array();
  }

  /*
   * Verify that a deck is owned by a given user_id
   * @param Connection $con A mysqli-wrapper Connection object
   * @param int $deck_id the public Deck ID
   * @param int $user_id a user's id
   * @return Array|False Deck returns the deck array, or false if keys don't match
   */
  public static function verify_owner($con, $deck_id, $user_id) {
    $results = $con->run('
      select * from decks
      where deck_id = ? and user_id = ?
      limit 1', 'ii',
      array($deck_id, $user_id));
    return $results->fetch_array();
  }

  /*
   * Retrieve a single deck
   * @param Connection $con A mysqli-wrapper Connection object
   * @param int $deck_id the ID of the deck
   * @return Array|False Card returns the deck, or false if no deck found
   */
  public static function get_deck($con, $deck_id) {
    $results = $con->run('
      select * from decks
      where deck_id = ?
      limit 1', 'i',
      $deck_id);
    return $results->fetch_array();
  }

  /*
   * Retrieve a single card from a deck
   * @param Connection $con A mysqli-wrapper Connection object
   * @param int $deck_id the ID of the deck
   * @param int $card_id the ID of the card
   * @return Array|False Card returns the card array, or false if keys don't match
   */
  public static function get_card($con, $deck_id, $card_id) {
    $results = $con->run('
      select * from cards
      where card_id = ? and deck_id = ?
      limit 1', 'ii',
      array($card_id, $deck_id));
    return $results->fetch_array();
  }

} ?>