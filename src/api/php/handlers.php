<?php

/**
 * Funzioni Handler
 *
 * Queste funzioni sono chiamate dal router e si occupano di interagire
 * con il database e di restituire la risposta in formato JSON.
 */

/**
 * Imposta l'header per la risposta JSON.
 */
function json_response($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
}

/**
 * Restituisce tutti gli utenti.
 */
function get_users($db) {
    $results = $db->query('SELECT * FROM users');
    json_response($results);
}

/**
 * Restituisce tutti i prodotti.
 */
function get_products($db) {
    $results = $db->query('SELECT * FROM products');
    json_response($results);
}
