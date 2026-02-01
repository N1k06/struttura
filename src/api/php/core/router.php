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
    // 1. Pulizia: Rimuoviamo slash iniziali/finali per evitare errori vuoti
    // Esempio: "/api/users/5/" diventa "api/users/5"
    $uriClean = trim(parse_url($uri, PHP_URL_PATH), '/');
    $uriParts = explode('/', $uriClean); // ['api', 'users', '5']

    // Cerchiamo tra tutte le rotte del metodo corrente (es. GET o PUT)
    if (isset($routes[$method])) {
        foreach ($routes[$method] as $routePattern => $handler) {
            
            // Puliamo anche la rotta definita nel file
            $routeClean = trim($routePattern, '/');
            $routeParts = explode('/', $routeClean); // ['api', 'users', ':id']

            // SE i pezzi sono di numero diverso, non è questa la rotta giusta
            if (count($uriParts) !== count($routeParts)) {
                continue;
            }

            $params = [];
            $match = true;

            // Confrontiamo pezzo per pezzo
            for ($i = 0; $i < count($routeParts); $i++) {
                $partRoute = $routeParts[$i];
                $partUri = $uriParts[$i];

                // CASO A: È un parametro dinamico (inizia con ':')
                if (str_starts_with($partRoute, ':')) {
                    $params[] = $partUri; // Salviamo il valore (es. "5")
                }
                // CASO B: È una parola statica (es. "api" o "users")
                elseif ($partRoute !== $partUri) {
                    $match = false; // Non corrispondono, rotta sbagliata
                    break; 
                }
            }

            // Se siamo arrivati qui e $match è ancora true, abbiamo trovato la rotta!
            if ($match) {
                if (function_exists($handler)) {
                    header('Content-Type: application/json');
                    // Passiamo DB + tutti i parametri trovati (es. l'ID)
                    call_user_func_array($handler, array_merge([$db], $params));
                    return;
                }
            }
        }
    }

    // Nessuna rotta trovata
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint non trovato.']);
}