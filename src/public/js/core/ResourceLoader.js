/**
 * Questa classe gestisce il caricamento dei controller e dei template.
 * Non modificare questo file se non vuoi alterare il funzionamento del micro-framework!
 */

export default class ResourceLoader {
    constructor() {
        // struttura dati per contenere i controller già caricati ed evitare duplicati
        this.loadedControllers = new Set();
    }

    get config() {
        return Alpine.store('config');
    }

    /**
     * prende il nome del template e lo scarica dall'opportuna directory e lo ritorna.
     */
    async fetchTemplate(templateName) {
        const path = `${this.config.templatePath}/${templateName}.html`;
        
        // cache busting timestamp (rimuovere timestamp in produzione)
        const response = await fetch(`${path}?t=${Date.now()}`);
        if (!response.ok) 
            throw new Error(`Template '${templateName}' non trovato`);
        
        return await response.text();
    }

    /**
     * carica il controller col nome specificato dall'opportuna directory.
     * se il file js del controller non viene trovato, non fa nulla, si ipotizza che 
     * l'utente voglia caricare un template statico (ie privacy policy, ecc...).
     * evita quindi la creazione di controller "vuoti" o placeholder soltanto per permettere
     * il caricamento di un template statico.
     */
    async loadController(controllerName) {
        // se l'ho già caricato esco subito
        if (this.loadedControllers.has(controllerName)) 
            return;

        const path = `${this.config.controllerPath}/${controllerName}.js`;

        try {
            const module = await import(path);
            // si ipotizza che il controller abbia un default export <nome_funz>
            if (module.default) {
                // registra il controller con Alpine e lo aggiunge alla lista dei controller caricati
                Alpine.data(controllerName, module.default);
                this.loadedControllers.add(controllerName);
                console.log(`[Loader] Controller '${controllerName}' registrato.`);
            }
        } catch (error) {
            // ignora errori di file non trovato (pagine statiche), ma lancia errori di sintassi JS
            if (!error.message.includes('Failed to fetch') && !error.message.includes('Module not found')) {
                throw error;
            }
        }
    }
}