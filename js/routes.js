import {isAuth} from "./controllers/sessionController.js"

const routes = {
  measures: () => import("../js/pages/measuresPage.js"),
  pets: () => import("../js/pages/properties/petsPage.js"),
  houses: () => import("../js/pages/properties/housesPage.js"),
  vehicles: () => import("../js/pages/properties/vehiclesPage.js"),
  food: () => import("../js/pages/resources/foodPage.js"),
  services: () => import("../js/pages/resources/servicesPage.js"),
  companies: () => import("../js/pages/others/companiesPage.js"),
  contries: () => import("../js/pages/others/countriesPage.js"),
  transport: () => import("../js/pages/others/transportationPage.js"),
  users: () => import("../js/pages/others/usersPage.js")
};
export async function startRouter() {
    window.addEventListener("pageshow", async (e) => {
        const auth = await isAuth();
        if (!auth) {
            window.location.href = "login.html";
        } 
    });

    const routeName = location.hash.slice(1) || 'measures';
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