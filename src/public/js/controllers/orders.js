import { createCrudController } from '../core/crudFactory.js';

export default function orders() {
    return createCrudController('orders', 'order_id', {
        
        // 1. Valori di default per "Nuovo Prodotto"
        defaultItem: { 
            user_name: '', 
            product_name: '',
            quantity: 0,
            created_at: ''
        },

        // 2. Definizione Colonne per la Tabella Generica
        columns: [
            { key: 'user_name', label: 'Utente', type: 'text' },
            { key: 'product_name', label: 'Prodotto', type: 'text' },
            { key: 'quantity', label: 'Quantità', type: 'number', step: '1'},
            { key: 'created_at', label: 'Data e ora', type: 'text' },
        ]
    });
}