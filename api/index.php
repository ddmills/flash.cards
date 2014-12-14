<?php
/* Include the API library */
require_once('lib/lightweight-rest/Rest_Api.php');
require_once('lib/mysqli-wrapper/Connection.php');
require_once('lib/Flash_Utils.php');

/* Create a new API with resources located in given folder */
$api = new Rest_Api('resources/');

/* Disable Cross-Origin Resource Sharing (read more at http://enable-cors.org/) */
$api->cors_enabled(false);

/* Define URL routes to resources */
$api->map('decks/',                                   'DeckCollection_Resource.php');
$api->map('decks/{num:deck_id}/',                     'Deck_Resource.php');
$api->map('decks/{num:deck_id}/cards/',               'CardCollection_Resource.php');
$api->map('decks/{num:deck_id}/cards/{num:card_id}/', 'Card_Resource.php');

/* Lastly, process the request! */
$api->process();
?>
