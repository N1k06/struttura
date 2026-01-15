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
 * Gestore generico per tabelle.
 * Estrae il nome della tabella dall'URI e restituisce tutti i record.
 * La sicurezza è garantita dal router che fa un match esatto dell'URI.
 */
function generic_table_handler($db) {
    // Estrae l'URI della richiesta, es. /api/users
    $uri = strtok($_SERVER['REQUEST_URI'], '?');

    // Rimuove /api/ per ottenere il nome della tabella, che corrisponde
    // esattamente alla parte finale della rotta definita in routes.php.
    $table_name = str_replace('/api/', '', $uri);

    try {
        $results = $db->query("SELECT * FROM {$table_name}");
        json_response($results);
    } catch (Exception $e) {
        // In produzione, è buona norma non esporre i dettagli specifici dell'errore.
        // Si potrebbe loggare $e->getMessage() in un file di log per il debug.
        json_response(['error' => 'Errore interno del server.'], 500);
    }
}

/**
 * Funzione di esempio per una rotta custom.
 */
function mostra_messaggio_di_prova($db) {
    json_response(['message' => 'Questa è una risposta dalla rotta di prova!']);
}