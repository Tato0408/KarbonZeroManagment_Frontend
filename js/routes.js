// js/routes.js
import { isAuth } from './controllers/sessionController.js';

const routes = {
    'measures': () => import('./pages/measuresPage.js'),
    'pets': () => import('./pages/properties/petsPage.js'),
    'houses': () => import('./pages/properties/housesPage.js'),
    'vehicles': () => import('./pages/properties/vehiclesPage.js'),
    'food': () => import('./pages/resources/foodPage.js'),
    'services': () => import('./pages/resources/servicesPage.js'),
    'companies': () => import('./pages/others/companiesPage.js'),
    'contries': () => import("../js/pages/others/countriesPage.js"),
    'transport': () => import('./pages/others/transportationPage.js'),
    'users': () => import('./pages/others/usersPage.js'),
};

export async function startRouter() {
    const app = document.getElementById('app');

    const guard = async () => {
        const ok = await isAuth();
        if (!ok) window.location.replace('/login.html'); 
        return ok;
    };

    const render = async () => {
        const routeName = location.hash.slice(1) || 'measures';
        const loader = routes[routeName];

        if (!loader) {
            app.innerHTML = `<h1 class="text-center my-5">404 · Página no encontrada</h1>`;
            return;
        }

        const module = await loader();
        app.innerHTML = await module.render();
        if (module.afterRender) module.afterRender();
        window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', async () => {
        if (await guard()) await render();
    });

    window.addEventListener('pageshow', guard);

    if (await guard()) await render();
}
