<?php

// handlers.php (I Lavoratori)

// Questo file contiene le funzioni che vengono effettivamente eseguite
// quando una rotta viene chiamata.

/**
 * Handler per la rotta di prova /api/prova
 */
function mostra_messaggio_di_prova() {
    // Semplicemente restituisce un oggetto JSON di esempio
    echo json_encode(['messaggio' => 'Il routing semplificato funziona correttamente!']);
}

/**
 * Handler per elencare gli utenti (GET /api/utenti)
 * @param object $db L'istanza del database iniettata dal router.
 */
function elenca_utenti($db) {
    try {
        // Esegue una semplice query SELECT
        $utenti = $db->query("SELECT id, nome, email FROM utenti");
        
        // Restituisce i risultati in formato JSON
        echo json_encode($utenti);
        
    } catch (Exception $e) {
        // Gestione base degli errori
        http_response_code(500);
        echo json_encode(['error' => 'Errore nel database: ' . $e->getMessage()]);
    }
}

/**
 * Handler per creare un nuovo utente (POST /api/utenti)
 * @param object $db L'istanza del database iniettata dal router.
 */
function crea_utente($db) {
    // Legge i dati grezzi inviati nel corpo della richiesta POST
    $dati_json = file_get_contents('php://input');
    // Decodifica la stringa JSON in un array associativo PHP
    $dati = json_decode($dati_json, true);

    // Validazione base dei dati
    if (empty($dati['nome']) || empty($dati['email'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'I campi nome e email sono obbligatori.']);
        return;
    }

    $nome = $dati['nome'];
    $email = $dati['email'];

    try {
        // Esegue una query INSERT sicura con i parametri
        $righe_inserite = $db->query("INSERT INTO utenti (nome, email) VALUES (?, ?)", [$nome, $email]);
        
        if ($righe_inserite > 0) {
            http_response_code(201); // Created
            echo json_encode(['messaggio' => 'Utente creato con successo.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Impossibile creare l\'utente.']);
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Errore nel database: ' . $e->getMessage()]);
    }
}
