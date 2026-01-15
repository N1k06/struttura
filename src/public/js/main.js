import { apiRequest } from './api_client.js';
import { loadTemplate } from './view_loader.js';

async function renderPage(pageName) {
    // 1. Prendi i dati dal backend PHP
    const dati = await apiRequest(`${pageName}.php`);

    // 2. Prendi il template HTML statico
    let template = await loadTemplate(pageName);

    // 3. Uniscili (Esempio super semplice di replace)
    for (let key in dati) {
        template = template.replace(`{{${key}}}`, dati[key]);
    }

    // 4. Inietta nel DOM
    document.getElementById('app').innerHTML = template;
}