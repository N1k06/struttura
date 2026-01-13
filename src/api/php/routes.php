<?php

// routes.php (La Mappa)

// Questo array associa un URI e un metodo HTTP a una specifica funzione
// definita nel file handlers.php.

$routes = [
    // Rotte che rispondono al metodo GET
    'GET' => [
        '/api/prova' => 'mostra_messaggio_di_prova',
        '/api/utenti' => 'elenca_utenti'
        // Aggiungi qui altre rotte GET
    ],

    // Rotte che rispondono al metodo POST
    'POST' => [
        '/api/utenti' => 'crea_utente'
        // Aggiungi qui altre rotte POST
    ],
    
    // Puoi aggiungere qui altri metodi come PUT, DELETE, etc.
];
