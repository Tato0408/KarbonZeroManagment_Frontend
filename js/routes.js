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
  const guard = async () => {
    const ok = await isAuth();
    if (!ok) window.location.replace('/login.html');
    return ok;
  };

  const render = async () => {
    const routeName = location.hash.slice(1) || 'measures';
    const viewLoader = routes[routeName];
    const app = document.getElementById('app');

    if (!viewLoader) {
      app.innerHTML = `
        <section class="d-flex align-items-center min-vh-100 py-5">
          <div class="container py-5">
            <div class="row align-items-center">
              <div class="col-md-6 order-md-2">
                <img class="img-fluid" src="/imgs/BoredParrot.png" alt="">
              </div>
              <div class="col-md-6 text-center text-md-start">
                <h1 class="display-1 fw-bold text-success">Error 404</h1>
                <p class="rfs-11 fw-light">La página que buscas fue movida, eliminada o nunca existió.</p>
              </div>
            </div>
          </div>
        </section>`;
      return;
    }

    const module = await viewLoader();
    app.innerHTML = await module.render();
    if (module.afterRender) module.afterRender();
  };

  window.addEventListener('pageshow', guard);
  window.addEventListener('hashchange', async () => {
    if (await guard()) await render();
  });

  if (await guard()) await render();
}