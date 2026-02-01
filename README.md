# Struttura

*"Tu volevi sapere che cos'è Matrix, vero? Trinity. Sta' tranquillo. Ti apparirà tutto assurdo. Questo è "struttura", il nostro programma di caricamento. Possiamo caricare di tutto: vestiti, equipaggiamento, armi, addestramento simulato, tutto quello di cui abbiamo bisogno." - Morpheus*

**Struttura** è un micro-framework full-stack di sviluppo "opinionated" per la creazione di web app moderne. Nasce dalla filosofia che un'architettura pulita, con una netta separazione dei compiti, sia la base fondamentale per qualsiasi progetto robusto e manutenibile.

Questo boilerplate fornisce un ambiente di sviluppo completo e "chiavi in mano" basato su Docker.

---

## Filosofia Architetturale

L'architettura di Struttura si basa su tre principi chiave:

1.  **Separazione dei Domini (Frontend/Backend):** L'interfaccia utente (il "cosa si vede") e la logica di business (il "come funziona") sono servizi completamente separati e indipendenti. Questo permette sviluppi paralleli, manutenzione semplificata e scalabilità futura.

2.  **API Gateway come Unico Punto d'Accesso:** Il frontend non comunica mai direttamente con i servizi di backend. Tutte le richieste passano attraverso un API Gateway (Nginx) che funge da "guardiano", smistando il traffico verso il servizio appropriato. Questo risolve problemi di sicurezza (CORS), semplifica il codice frontend e nasconde la complessità dell'infrastruttura.

3.  **Sviluppo in Container:** L'intero ambiente è definito in codice tramite Docker e Docker Compose. Questo garantisce un'esperienza di sviluppo consistente, portabile e riproducibile, eliminando il classico problema del "funziona solo sulla mia macchina".

---

## Stack Tecnologico

Le tecnologie sono state scelte per favorire la semplicità, la leggerezza e il pieno controllo da parte dello sviluppatore.

*   **Frontend:**
    *   **Vanilla JavaScript:** Nessun framework pesante, nessuna compilazione. Puro JavaScript per la massima velocità e controllo sul DOM.
    *   **Bulma CSS:** Un moderno framework CSS basato su Flexbox, elegante e senza una singola riga di JavaScript.
    *   **Template HTML:** Caricamento, rendering e riuso di componenti in maniera dinamica senza uscire da HTML puro, e senza dover scrivere HTML direttamente dentro JavaScript.

*   **Backend:**
    *   **PHP 8+ (con Apache):** Un linguaggio solido, maturo e performante per la logica di business. L'uso di Apache con `.htaccess` permette un routing flessibile.
    *   **MariaDB:** Un database relazionale robusto e affidabile, pienamente compatibile con MySQL.

*   **Infrastruttura:**
    *   **Docker & Docker Compose:** Per la containerizzazione dell'intero stack (frontend, backend, database).
    *   **Nginx:** Agisce come web server per il frontend e, soprattutto, come **Reverse Proxy / API Gateway** per tutte le chiamate al backend.

*   **Formato di Scambio Dati:**
    *   **JSON:** Lo standard de-facto per la comunicazione tra frontend e backend API.

---

## Flusso di una Richiesta

1.  L'utente visita `http://localhost:4000`. **Nginx** risponde servendo i file statici del frontend da `src/public`.
2.  Il JavaScript del frontend esegue una chiamata API a `http://localhost:4000/api/users`.
3.  **Nginx** intercetta la richiesta. Poiché inizia con `/api/`, non la gestisce come un file statico, ma la inoltra (proxy pass) al servizio `php-app`.
4.  Il container **php-app** (Apache + PHP) riceve la richiesta per `/api/users`, la elabora tramite il router PHP, interagisce con il database e restituisce una risposta JSON.
5.  **Nginx** riceve la risposta dal backend e la inoltra al browser dell'utente.

---

## Come Iniziare

**Prerequisiti:** Docker e Docker Compose installati.

1.  Clonare il repository.
2.  Aprire un terminale nella cartella `config/`.
3.  Eseguire il comando:
    ```bash
    bash setup.sh
    ```
4.  L'ambiente sarà pronto ai seguenti indirizzi:
    *   **Frontend:** `http://localhost:4000`
    *   **Backend API:** Accessibile tramite il frontend all'endpoint `/api/` o tramite `http://localhost:3000/api/`
    *   **phpMyAdmin:** `http://localhost:8080` (per la gestione del database)

Ora sei nella Struttura.
