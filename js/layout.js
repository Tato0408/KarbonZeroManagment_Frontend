
const sidebar = document.getElementById("sidebar");
const sidebarToggler = document.querySelector(".menu-toggle");
const mainContent = document.getElementById("main-content");

sidebarToggler.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

const HTML_PATH = "views/";
const CSS_PATH = "css/";
const JS_PATH = "js/";

const routes = {
  "Canal": "canal.html",
  "Medidas": "medidas.html",
  'Mascota': 'mascota.html',
  'Vehículo': 'vehiculo.html',
  'Vivienda': 'vivienda.html',
  "Alimentos": "alimentos.html",
  "Servicios": "servicios.html",
  'Compañías': 'compañias.html',
  'Países': 'paises.html',
  'Transporte': 'transporte.html',
  'Logros': 'logros.html',
  'Usuario' : 'usuarios.html'
};

const initializers = {
  ///TODO: Initializers de cada pagina
  'mascota.html' : 'initPet',
  'vehiculo.html' : 'initVehicle',
  'vivienda.html' : 'initdwellin',
  'compañias.html' : 'initCompani',
  'paises.html' : 'initCountry',
  'transporte.html' : 'initTransport',
  'logros.html' : 'initAchievements',
  'medidas.html': 'initMeasures',
  'alimentos.html': 'initFoods',
  'servicios.html': 'initServices',
  'canal.html':"initChannel",
  'usuarios.html' : 'initUsers',
};

function loadCSSIfExists(path) {
  fetch(path, { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        document.querySelector(`link[data-dynamic-css="${path}"]`)?.remove();
        const link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = path;
        link.setAttribute("data-dynamic-css", path);
        document.head.appendChild(link);
      }
    })
    .catch(() => { });
}

function loadJSIfExists(path, initFn) {
  fetch(path, { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        const script = document.createElement('script');
        script.src = path;
        script.onload = () => {
          if (initFn && typeof window[initFn] === "function") {
            window[initFn]();
          }
        };
        document.body.appendChild(script);
      }
    })
    .catch(() => { });
}

function loadContent(pageUrl) {
  mainContent.classList.add("fade-out");

  setTimeout(() => {
    fetch(pageUrl)
      .then(resp => {
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.text();
      })
      .then(htmlText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        //! inyectamos únicamente lo que haya dentro de <body>
        mainContent.innerHTML = doc.body.innerHTML;

        const fileName = pageUrl.split("/").pop().replace(".html", "");

        loadCSSIfExists(`${CSS_PATH}${fileName}.css`);
        const initFn = initializers[`${fileName}.html`];
        if (initFn) loadJSIfExists(`${JS_PATH}${fileName}.js`, initFn);
        //?Animacion al entrar y salir
        setTimeout(() => {
          mainContent.classList.remove("fade-out");
          mainContent.classList.add("fade-in");
          setTimeout(() => mainContent.classList.remove("fade-in"), 300);
        }, 10);
      })
      ///Manejar error si por caso de la vida no podemos cargar la pagina
      .catch(err => {
        console.error("loadContent:", err);
        mainContent.innerHTML = `
          <div class="alert alert-danger">
            <strong>Error:</strong> No se pudo cargar "${pageUrl}".
          </div>`;
      });
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  sidebar.addEventListener("click", e => {
    const a = e.target.closest("a.nav-link");
    if (!a) return;

    const texto = a.textContent.trim();
    const ruta = routes[texto];
    if (!ruta) return;

    e.preventDefault();
    loadContent(HTML_PATH + ruta);

    if (window.innerWidth <= 768) {
      sidebar.classList.remove("show");
    }
  });


  loadContent(HTML_PATH + routes["Canal"]);
});
document.addEventListener("click", function (event) {
  const isClickInsideSidebar = sidebar.contains(event.target);
  const isClickOnToggle = sidebarToggler.contains(event.target);


  if (window.innerWidth <= 768 && sidebar.classList.contains("show") && !isClickInsideSidebar && !isClickOnToggle) {
    sidebar.classList.remove("show");
  }
});


