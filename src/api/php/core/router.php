<?php

/**
 * Funzione di Routing (Lo Smistatore)
 *
 * Questa funzione riceve la mappa delle rotte e la richiesta attuale,
 * e si occupa di chiamare la funzione handler corretta.
 *
 * @param array $routes La mappa di tutte le rotte disponibili (da routes.php).
 * @param string $method Il metodo HTTP della richiesta (es. 'GET', 'POST').
 * @param string $uri L'URI della richiesta (es. '/api/utenti').
 * @param object $db L'istanza del nostro oggetto Database.
 */
function route($routes, $method, $uri, $db) {
    // Controlla se esiste una rotta per il metodo e l'URI richiesti
    if (isset($routes[$method]) && isset($routes[$method][$uri])) {
        
        // Ottiene il nome della funzione handler da chiamare
        $handler_function = $routes[$method][$uri];
        
        // Controlla se la funzione handler esiste veramente nel file handlers.php
        if (function_exists($handler_function)) {
            
            // Imposta l'header per far capire al browser che stiamo inviando JSON
            header('Content-Type: application/json');
            
            // Chiama la funzione handler, passandole l'oggetto DB
            $handler_function($db);
            
        } else {
            // Errore interno del server: la rotta è definita ma la funzione non esiste
            http_response_code(500);
            echo json_encode(['error' => "Errore del server: la funzione '$handler_function' non è stata trovata."]);
        }
    } else {
        // Errore: la pagina richiesta non è stata trovata
        http_response_code(404);
        echo json_encode(['error' => 'Pagina non trovata.']);
    }
}
