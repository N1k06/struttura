import { createCrudController } from '../core/crudFactory.js';

export default function users() {
    return createCrudController('users', 'user_id', {
        
        // valori default
        defaultItem: { 
            name: '', 
            email: '',
            password: '',
        },

        // colonne tabella
        columns: [
            { key: 'name', label: 'Utente', type: 'text' },
            { key: 'email', label: 'Email', type: 'text' },
            { key: 'password', label: 'Password', type: 'password' },
        ]
    });
}