<?php

/**
 * Classe Database Helper (Singleton)
 *
 * Questa classe gestisce la connessione al database e semplifica l'esecuzione
 * di query sicure usando i "prepared statements" di mysqli.
 *
 * Utilizza il pattern Singleton per garantire che esista una sola istanza
 * della connessione al database durante l'intero ciclo di vita della richiesta,
 * ottimizzando le risorse.
 */
class Database {
    // Contiene l'unica istanza della classe
    private static $instance = null;
    
    // Contiene l'oggetto della connessione mysqli
    private $conn;

    // Dettagli per la connessione al database, presi da docker-compose.yml
    private $host = 'db';
    private $user = 'user';
    private $pass = 'user';
    private $name = 'root_db';

    /**
     * Il costruttore è privato per impedire la creazione di nuove istanze
     * dall'esterno della classe (pattern Singleton).
     */
    private function __construct() {
        // Crea una nuova connessione mysqli
        $this->conn = new mysqli($this->host, $this->user, $this->pass, $this->name);

        // Controlla e gestisce eventuali errori di connessione
        if ($this->conn->connect_error) {
            // In un'applicazione reale, qui si gestirebbe l'errore in modo più elegante
            die("Errore di connessione al DB: " . $this->conn->connect_error);
        }
    }

    /**
     * Metodo statico pubblico per ottenere l'unica istanza della classe.
     *
     * @return Database L'istanza della classe Database.
     */
    public static function getInstance() {
        if (self::$instance == null) {
            // Se non esiste ancora un'istanza, ne crea una nuova.
            self::$instance = new Database();
        }
        // Restituisce l'istanza esistente.
        return self::$instance;
    }

    /**
     * Esegue una query SQL sicura usando i prepared statements.
     *
     * @param string $sql La query SQL con i segnaposto '?'.
     * @param array $params Un array di parametri da legare alla query.
     * @return mixed Per le query SELECT, restituisce un array di righe.
     *               Per INSERT, UPDATE, DELETE, restituisce il numero di righe modificate.
     */
    public function query($sql, $params = []) {
        // 1. Prepara la query SQL per evitare SQL injection
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            die("Errore nella preparazione della query: " . $this->conn->error);
        }

        // 2. Se ci sono parametri, li lega alla query
        if (!empty($params)) {
            // Determina dinamicamente i tipi dei parametri (es. 's' per string, 'i' per int)
            $types = '';
            foreach ($params as $param) {
                if (is_int($param)) {
                    $types .= 'i';
                } elseif (is_float($param)) {
                    $types .= 'd';
                } else {
                    $types .= 's';
                }
            }
            // Usa l'operatore "splat" (...) per passare i parametri a bind_param
            $stmt->bind_param($types, ...$params);
        }

        // 3. Esegue la query
        $stmt->execute();

        // 4. Determina cosa restituire
        if (stripos(trim($sql), 'SELECT') === 0) {
            // Se è una query SELECT, restituisce i risultati
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return $data;
        } else {
            // Se è INSERT, UPDATE, o DELETE, restituisce il numero di righe modificate
            $affected_rows = $stmt->affected_rows;
            $stmt->close();
            return $affected_rows;
        }
    }

    /**
     * Il distruttore viene chiamato quando l'oggetto non è più referenziato,
     * assicurando che la connessione al database venga chiusa correttamente.
     */
    public function __destruct() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}
