// js/routes.js
import { isAuth } from './controllers/sessionController.js';

// Mapa hash -> módulo
const routes = {
  dashboard:    () => import('../js/pages/dashboardPage.js'),
  consumptions: () => import('../js/pages/consumptionsPage.js'),
  reports:      () => import('../js/pages/reportsPage.js'),
  map:          () => import('../js/pages/mapPage.js'),
  resources:    () => import('../js/pages/resourcesPage.js'),
  users:        () => import('../js/pages/usersPage.js'),
  userProfile:  () => import('../js/pages/userProfilePage.js'),
  channel:      () => import('../js/pages/channelPage.js'),
};

export async function startRouter() {
  const app = document.getElementById('app');

  // 1) Guardia de autenticación
  const guard = async () => {
    const ok = await isAuth();
    if (!ok) window.location.replace('/login.html'); // usar ruta absoluta
    return ok;
  };

  // 2) Renderizado por hash
  const render = async () => {
    const routeName = (location.hash || '#dashboard').slice(1);
    const loader = routes[routeName];

    if (!loader) {
      app.innerHTML = `
        <section class="d-flex align-items-center min-vh-100 py-5">
          <div class="container py-5">
            <div class="row align-items-center">
              <div class="col-md-6 order-md-2">
                <img class="img-fluid" src="/imgs/BoredParrot.png" alt="Not found">
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

    const module = await loader();
    app.innerHTML = await module.render();
    if (module.afterRender) module.afterRender();
    window.scrollTo(0, 0);
  };

  // 3) Navegación
  window.addEventListener('hashchange', async () => {
    if (await guard()) await render();
  });

  // Soporta bfcache (back/forward)
  window.addEventListener('pageshow', guard);

  if (await guard()) await render();
}
