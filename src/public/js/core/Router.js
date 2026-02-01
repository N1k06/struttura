import ResourceLoader from './ResourceLoader.js';

/**
 * Questa classe gestisce le rotte.
 * Non modificare questo file se non vuoi alterare il funzionamento del micro-framework!
 * 
 * Definisce la funzione associata agli eventi di click dei fragment per poterne gestire le rotte.
 * La gestione della rotta visitat (o fragment cliccato) viene delegata al controller.
 */
export default class Router {
    constructor(routes) {
        this.loader = new ResourceLoader();
        this.routes = routes;
        
        // --- FIX DEL CONTESTO 'THIS' ---
        // Assicura che 'this' all'interno di handleRoute si riferisca sempre a questa istanza (Router).
        // Senza .bind(), quando il browser lancia l'evento, 'this' diventerebbe l'oggetto 'Window'
        // e il codice non troverebbe più 'this.loader' o 'this.routes'.
        this.handleRoute = this.handleRoute.bind(this);
    }

    init() {
        // associa agli eventi di cambio fragment e caricamento pagina il metodo per gestire le rotte
        window.addEventListener('hashchange', this.handleRoute);
        window.addEventListener('load', this.handleRoute);
    }

    get appConfig() {
        return Alpine.store('config');
    }

    // metodo principale della classe: gestisce le rotte caricando il rispettivo controller
    async handleRoute() {
        // prende il fragment corrente dalla URL. se non è possibile usa il default
        const hash = location.hash.slice(1) || this.appConfig.defaultRoute;
        
        // ottiene il nome del controller e il viewport su cui visualizzare i contenuti
        const { controllerName, viewportId } = this._resolveRoute(hash);
        
        // prende il riferimento del viewport nel DOM della pagina
        const viewport = document.getElementById(viewportId);
        if (!viewport) {
            console.error(`[Router] Viewport '${viewportId}' non trovato.`);
            return;
        }

        try {
            // prende il codice ritornato dal controller e lo renderizza nel viewport
            const html = await this._loadResources(controllerName);
            this._render(viewport, html, viewportId);
        } catch (error) {
            this._renderError(viewport, error);
        }
    }

    /**
     * HELPER 1: Logica di Routing
     * Input: URL hash -> Output: Configurazione {controller, viewport}
     */
    _resolveRoute(hash) {
        // cerca nella mappa o usa fallback:
        // se non è definito esplicitamente un controller per un fragment,
        // usa il nome del fragment come controller.
        const routeConfig = this.routes[hash] || { controller: hash };

        return {
            controllerName: routeConfig.controller,
            // se la rotta non specifica un viewport, usa quello di default
            viewportId: routeConfig.viewport || this.appConfig.defaultViewportId
        };
    }

    /**
     * HELPER 2: Caricamento Dati
     * Parla con il ResourceLoader, gli dice di caricare l'opportuno controller,
     * scarica e ritorna l'html del template.
     */
    async _loadResources(controllerName) {
        // Carica la logica JS (se esiste)
        await this.loader.loadController(controllerName);
        return await this.loader.fetchTemplate(controllerName);
    }

    /**
     * HELPER 3: Aggiornamento DOM
     * Scrive l'HTML e gestisce lo scroll
     */
    _render(viewport, html, viewportId) {
        viewport.innerHTML = html;
        // se l'utente aggiorna il viewport principale la finestra deve tornare in alto,
        // invece in caso di aggiornamento di viewport secondari (ie sidebar) resta così.
        if (viewportId === this.appConfig.defaultViewportId) {
            window.scrollTo(0, 0);
        }
    }

    /**
     * HELPER 4: Gestione Errori UI
     */
    _renderError(viewport, error) {
        console.error('[Router] Errore:', error);
        viewport.innerHTML = `
            <div class="uk-alert uk-alert-danger">
                <h3>Errore</h3>
                <p>${error.message}</p>
            </div>`;
    }
}