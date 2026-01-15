// js/routes.js

export const routes = {
    "/": { 
        template: "home.html", 
        controller: "home.js",
        title: "Home - Mio Framework" 
    },
    "/prodotti": { 
        template: "prodotti.html", 
        controller: "prodotti.js",
        title: "I nostri Prodotti" 
    },
    "/contatti": { 
        template: "contatti.html", 
        controller: "contatti.js",
        title: "Contattaci" 
    },
    "404": { 
        template: "404.html", 
        controller: null,
        title: "Pagina non trovata" 
    }
};