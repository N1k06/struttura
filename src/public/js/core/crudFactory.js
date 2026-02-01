// js/core/crudFactory.js

export function createCrudController(endpoint, pkName = 'id', config = {}) {
    // Estraiamo i default e le colonne dalla configurazione opzionale
    const { defaultItem = {}, columns = [] } = config;

    return {
        // --- STATO ---
        items: [],
        currentItem: {}, 
        editingId: null,      // ID dell'item in modifica (o -1 se nuovo)
        isLoading: false,
        isSaving: false,
        
        // Esporriamo questi dati perché servono all'HTML Generico
        columns: columns,     // Per generare i <th> e i <td> dinamicamente
        pkName: pkName,       // Per sapere quale chiave usare nei loop (item[pkName])

        // Configurazione interna (utile per logica interna)
        config: {
            pk: pkName,
            template: defaultItem 
        },

        get isAdding() {
            return this.editingId === -1;
        },

        // --- COMPUTED ---
        get apiUrl() { 
            // Assicurati che Alpine.store('config') sia definito nel tuo main.js
            return `${Alpine.store('config').apiBase}/${endpoint}`; 
        },

        // --- METODI ---

        async init() { 
            await this.loadAll(); 
        },

        async loadAll() {
            this.isLoading = true;
            try {
                const res = await fetch(this.apiUrl);
                if(!res.ok) throw new Error(`Errore API: ${res.statusText}`);
                
                const data = await res.json();
                // Gestisce sia array diretto [..] che risposta paginata { data: [..] }
                this.items = Array.isArray(data) ? data : (data.data || []);
            } catch (e) {
                console.error("Errore caricamento:", e);
                // Opzionale: notifica errore UIkit
                // UIkit.notification({message: 'Impossibile caricare i dati', status: 'danger'});
            } finally {
                this.isLoading = false;
            }
        },

        createItem() {
            // Se stiamo già editando qualcosa, impediamo di crearne un altro
            if (this.editingId !== null) return;

            console.log('Creazione nuovo item...'); 

            // Creiamo il nuovo oggetto fondendo l'ID temporaneo (-1) con il template di default
            const newItem = { 
                [this.pkName]: -1, // Usa la chiave dinamica (es. product_id: -1)
                ...JSON.parse(JSON.stringify(this.config.template)) // Clone profondo del template
            };
            
            // Lo aggiungiamo in cima alla lista visuale
            this.items.unshift(newItem);
            
            // Avviamo subito l'editing
            this.startEdit(newItem);
        },

        startEdit(item) {
            // Salviamo l'ID corrente
            this.editingId = item[this.pkName];
            
            // Creiamo una copia "deep" per non modificare la riga finché non salviamo
            this.currentItem = JSON.parse(JSON.stringify(item));
        },

        cancelEdit() {
            // Se stavamo creando un NUOVO elemento (ID -1), lo rimuoviamo dalla lista
            if (this.editingId === -1) {
                this.items.shift(); 
            }
            
            // Reset dello stato
            this.editingId = null;
            this.currentItem = {};
        },

        async saveItem() {
            if (!this.editingId) return;
            this.isSaving = true;

            try {
                const key = this.pkName;
                const isNew = this.editingId === -1;
                
                // Determina URL e Metodo
                const url = isNew 
                    ? this.apiUrl 
                    : `${this.apiUrl}/${this.currentItem[key]}`;
                
                const method = isNew ? 'POST' : 'PUT';

                // PULIZIA: Se è nuovo, rimuoviamo l'ID fittizio (-1) prima di inviare al server
                // Molti backend (es. SQL) si arrabbiano se mandi un ID in un POST
                if (isNew) {
                    delete this.currentItem[key];
                }

                // Chiamata API
                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.currentItem)
                });

                if (!res.ok) throw new Error('Errore durante il salvataggio');

                // SUCCESSO
                // Ricarichiamo tutto per avere i dati freschi (inclusi ID generati dal DB)
                this.editingId = null;
                await this.loadAll(); 
                
                // Opzionale: Notifica successo
                // UIkit.notification({message: 'Salvato con successo', status: 'success'});

            } catch (e) {
                alert('Errore: ' + e.message);
                console.error(e);
            } finally {
                this.isSaving = false;
            }
        },
        
        async deleteItem(item) {
             if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;
             
             const key = this.pkName;
             const id = item[key];
             
             try {
                 const res = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
                 if(!res.ok) throw new Error('Errore cancellazione');

                 // Rimuoviamo l'elemento dall'array locale senza ricaricare tutto (più veloce)
                 this.items = this.items.filter(i => i[key] !== id);
                 
             } catch(e) { 
                 alert(e.message); 
             }
        }
    };
}