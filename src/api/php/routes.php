<?php
// Questo array associa un URI e un metodo HTTP a una specifica funzione
// definita nel file handlers.php.

$routes = [
    // Rotte che rispondono al metodo GET
    'GET' => [
        // Rotta custom che usa un suo handler specifico
        '/api/prova' => 'mostra_messaggio_di_prova',
        // Rotte che usano il gestore generico per tabelle
        '/api/users' => 'generic_table_handler',
        '/api/products' => 'generic_table_handler'
    ],

    // Rotte che rispondono al metodo POST
    'POST' => [
        // Aggiungi qui altre rotte POST
    ],
    
    // Puoi aggiungere qui altri metodi come PUT, DELETE, etc.
];
