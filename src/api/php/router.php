<?php
//require_once '../app/router.php';

$routes = [
    'GET' => [
        //'/api/articoli' => 'gestisci_elenco_articoli',
    ],
    'POST' => [
        // '/api/auth' => 'gestisci_autenticazione',
    ],
    'PUT' => [
        // '/api/articoli/{categoria}/{sottocategoria}/{slug}' => 'modifica_articolo',
    ]
];

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

echo "Metodo: " . $method . "<br>";
echo "URI: " . $uri . "<br>";

//router($method, $uri, $routes);
?>