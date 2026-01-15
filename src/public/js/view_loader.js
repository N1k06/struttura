// carica un template HTML da un file locale e lo restituisce come stringa.
export async function loadTemplate(name) {
    const response = await fetch(`./templates/${name}.html`);
    return await response.text();
}