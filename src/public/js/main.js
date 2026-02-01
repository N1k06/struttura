// main.js
import { App } from './core/App.js';

// definizione mapping rotte 
// indica al router quale controller deve gestire quale fragment
// e in quale viewport deve inserire i contenuti (se omesso si usa il default)
const myRoutes = {
    // '<fragment>' : { controller: '<controller>' [, viewport: '<viewport>'] }
    'home':     { controller: 'home' },
    //'products': { controller: 'products' },
    'login':    { controller: 'auth' },
    
    // Esempio con viewport non default
    //'cart':     { controller: 'cart', viewport: 'sidebar' }
};

// parametri globali
const myConfig = {
    apiBase: 'api', // url base del webservice che fornisce i dati json
    defaultRoute: 'home', 
    defaultViewportId: 'app-viewport' // viewport di default usato se omesso nel mapping delle rotte
};

// instanzia l'app con la configurazione scelta e la avvia
const app = new App(myConfig, myRoutes);
app.start();