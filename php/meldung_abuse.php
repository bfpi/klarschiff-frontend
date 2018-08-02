<?php

$config = include(dirname(__FILE__) . "/../config/config.php");
include_once("backend_tunnel.php");
include_once(dirname(__FILE__) . "/functions.php");

/**
 * @file
 * Frontend-Fassade für Absetzen einer Missbrauchsmeldung
 */
$data = array(
  "vorgang" => $_REQUEST["id"],
  "text" => $_REQUEST["details"],
  "email" => $_REQUEST["email"],
  "datenschutz" => $_REQUEST["datenschutz"]
);

/* * ************************************************************************** */
/*                     VALIDIERUNG & TRANSFORMIERUNG                         */
/* * ************************************************************************** */
$trashmail_check = trashmail_check($config, $data['email']);
if ($trashmail_check) {
  die($trashmail_check);
}

$answer = returnRelay($data, "missbrauchsmeldung");

print(utf8_decode($answer['content']));
