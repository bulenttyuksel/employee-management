import { Router } from '@vaadin/router';
import '../src/components/employee-table.js';

const appRoot = document.querySelector('app-root');
const outlet = appRoot?.shadowRoot.querySelector('#router-outlet');

if (outlet) {
    const router = new Router(outlet);

    router.setRoutes([
        {
            path: '/',
            component: 'employee-table'
        },
        {
            path: '/add',
            component: 'add-employee',
            action: () => import('../src/components/add-employee.js')
        },
        {
            path: '/edit/:id',
            component: 'edit-employee',
            action: () => import('../src/components/edit-employee.js')
        },
        {
            path: '(.*)',
            component: 'not-found-view',
            action: () => import('../src/components/not-found-view.js')
        },
    ]);

    window.addEventListener('vaadin-router-location-changed', (e) => {
        console.log('Route changed to:', e.detail.location.pathname);
    });
} else {
    console.error('[Vaadin.Router] #router-outlet not found in the Shadow DOM');
}
