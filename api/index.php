<?php
/* start session */
session_start();

// error_reporting(0);
date_default_timezone_set("America/Chicago");

/* Include the API library */
require_once('lib/lightweight-rest/Rest_Api.php');
require_once('lib/mysqli-wrapper/mywrap.php');
require_once('lib/Flash_Utils.php');
require_once('lib/User_Manager.php');

/* Create a new API with resources located in given folder */
$api = new Rest_Api('resources/');

/* Disable Cross-Origin Resource Sharing (read more at http://enable-cors.org/) */
$api->cors_enabled(false);

/* Card and deck resources */
$api->map('decks/',                                   'DeckCollection_Resource.php');
$api->map('decks/{num:deck_id}/',                     'Deck_Resource.php');
$api->map('decks/{num:deck_id}/cards/',               'CardCollection_Resource.php');
$api->map('decks/{num:deck_id}/cards/{num:card_id}/', 'Card_Resource.php');
$api->map('decks/browse/recent/',                     'Browse_Resource.php');

/* User resources */
$api->map('users/',               'UserCollection_Resource.php');
$api->map('users/{num:user_id}/', 'User_Resource.php');

/* Lastly, process the request! */
$api->process();
?>