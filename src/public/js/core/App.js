import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.13.5/dist/module.esm.js';
import Router from './Router.js';

/**
 * Questa classe è il "motore" del sito.
 * Non modificare questo file se non vuoi alterare il funzionamento del micro-framework!
 */
export class App {
    /**
     * @param {Object} config - Configurazione generale (API, percorsi, viewport ID)
     * @param {Object} routes - Mappa delle rotte '<fragment>' : { controller: '<controller>' [, viewport: '<viewport>'] }
     */
    constructor(config, routes) {
        this.config = config;
        this.routes = routes;
        
        this.setupAlpine();
        // istanzia il router passando il mapping fragment-controller-viewport
        this.router = new Router(this.routes);
    }

    // carica Alpine e lo inizializza
    setupAlpine() {
        window.Alpine = Alpine;
        
        // usa lo store globale di Alpine per salvare la configurazione
        Alpine.store('config', {
            templatePath: 'templates',          // default
            controllerPath: '../controllers',   // default
            defaultRoute: 'home',
            defaultViewportId: 'app-main',
            ...this.config                      // aggiunge/sovrascrive con la config custom
        });

        Alpine.start();
    }

    start() {
        this.router.init();
        console.log('App avviata correttamente.');
    }
}