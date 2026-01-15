// js/Router.js
import { loadTemplate } from './view_loader.js';

export default class Router {
    // Proprietà della classe
    routes = {};
    container = null;

    constructor(routes, containerId = "app") {
        this.routes = routes; // Assegna le rotte passate all'attributo della classe
        this.container = document.getElementById(containerId);
        this._init();
    }

    _init() {
        window.addEventListener("popstate", () => this.handleRoute());
        
        document.addEventListener("click", e => {
            const link = e.target.closest("[data-link]");
            if (link) {
                e.preventDefault();
                this.navigate(link.getAttribute("href"));
            }
        });

        this.handleRoute();
    }

    async navigate(path) {
        if (window.location.pathname === path) return;
        window.history.pushState({}, "", path);
        await this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes["404"];

        // Caricamento del template tramite attributo della rotta
        const html = await loadTemplate(route.template);
        this.container.innerHTML = html;
        document.title = route.title || "My Framework";

        // Esecuzione controller
        if (route.controller) {
            try {
                const module = await import(`./views/${route.controller}`);
                if (module.init) module.init();
            } catch (err) {
                console.error("Errore controller:", err);
            }
        }
    }
}