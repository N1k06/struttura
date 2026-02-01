import { createCrudController } from '../core/crudFactory.js';

export default function products() {
    return createCrudController('products', 'product_id', {
        title: 'Gestione Prodotti',
        defaultItem: { name: '', description: '', price: 0 },

        columns: [
            { 
                key: 'name', 
                label: 'Prodotto', 
                type: 'text',
                width: 'uk-width-2xlarge' // <--- Fissa la larghezza (es. 250px)
            },
            { 
                key: 'description', 
                label: 'Descrizione', 
                type: 'text',
                width: 'uk-width-2xlarge' // <--- Prende tutto lo spazio libero
            },
            { 
                key: 'price', 
                label: 'Prezzo', 
                type: 'number', 
                step: '0.01', 
                suffix: ' €',
                width: 'uk-width-2xlarge'  // <--- Fissa la larghezza (es. 150px)
            }
        ]
    });
}