<?php
// Questo array associa un URI e un metodo HTTP a una specifica funzione
// definita nel file handlers.php.

$routes = [
    // Rotte che rispondono al metodo GET
    'GET' => [
        '/api/prova' => 'mostra_messaggio_di_prova',
        '/api/users' => 'get_users',
        '/api/products' => 'get_products'
    ],

    // Rotte che rispondono al metodo POST
    'POST' => [
        // Aggiungi qui altre rotte POST
    ],
    
    // Puoi aggiungere qui altri metodi come PUT, DELETE, etc.
];
