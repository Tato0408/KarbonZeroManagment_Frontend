const routes = {
    'channel': () => import('../js/pages/channelPage.js'),
    'measures': () => import('../js/pages/measuresPage.js'),
    'pets': ()=> import('../js/pages/properties/petsPage.js'),
    'houses': ()=> import('../js/pages/properties/housesPage.js'),
    'vehicles': ()=> import('../js/pages/properties/vehiclesPage.js'),
    'food': ()=> import('../js/pages/resources/foodPage.js'),
    'services': ()=> import('../js/pages/resources/servicesPage.js'),
    'companies': ()=> import('../js/pages/others/companiesPage.js'),
    'achivements': ()=> import('../js/pages/others/achivementsPage.js'),
    'contries': ()=> import('../js/pages/others/countriesPage.js'),
    'users': ()=> import('../js/pages/others/usersPage.js'),
    'transport': ()=> import('../js/pages/others/transportationPage.js'),


}
export async function startRouter() {
    const routeName = location.hash.slice(1) || 'channel';
    const app = document.getElementById('app');
    const viewLoader = routes[routeName];

    if (viewLoader) {
        const module = await viewLoader();
        app.innerHTML = await module.render();
        if (module.afterRender) module.afterRender();
    } else {
        app.innerHTML = `<h1>404 Página no encontrada</h1>`;
    }
}