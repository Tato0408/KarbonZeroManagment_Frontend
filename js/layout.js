function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("show");
}

const HTML_PATH = "views/";
const CSS_PATH = "css/";
const JS_PATH = "js/";


const routes = {
    'canal': 'canal.html',
    'medidas': 'medidas.html',
    'mascota': 'mascota.html',
    'vehiculo': 'vehiculo.html',
    'vivienda': 'vivienda.html',
    'alimentos': 'alimentos.html',
    'servicios': 'servicios.html',
    'compañias': 'compañias.html',
    'paises': 'paises.html',
    'transporte': 'transporte.html',
    'logros': 'logros.html'
};

const initializers = {

};

function loadContent(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar la vista.');
            return response.text();
        })
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
        })
        .catch(error => {
            console.error('Error al cargar contenido:', error);
            document.getElementById('main-content').innerHTML = '<p>Error al cargar la vista.</p>';
        });
}


document.addEventListener('DOMContentLoaded', () => {
    loadContent('views/canal.html');

    document.querySelectorAll('.sidebar a.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href.startsWith('#')) return;

            e.preventDefault();

            loadContent(href);

            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('show');
            }
        });
    });
});

function loadContent(pagePath) {
    const container = document.getElementById('main-content');
    if (!container) return;

    container.classList.add('fade-out');

    setTimeout(() => {
        fetch(pagePath)
            .then(res => res.text())
            .then(html => {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const body = temp.querySelector('body');
                container.innerHTML = body ? body.innerHTML : html;

                const cssPath = CSS_PATH + fileName + '.css';
                document.querySelector(`link[data-dynamic-css="${cssPath}"]`)?.remove();
                loadCSSIfExists(cssPath);


                const initFn = initializers[fileName + '.html'];
                if (initFn) {
                    const jsPath = JS_PATH + fileName + '.js';
                    document.querySelector(`script[src="${jsPath}"]`)?.remove();
                    window[initFn] = undefined;
                    loadJSIfExists(jsPath, initFn);
                }
                ///Aca la animacion de entrada 
                setTimeout(() => {
                    container.classList.remove('fade-out');
                    container.classList.add('fade-in');
                    setTimeout(() => container.classList.remove('fade-in'), 300);
                }, 10);
            })
            ///Manejar error si por caso de la vida no podemos cargar la pagina
            .catch(err => {
                console.error(`Error cargando ${pagePath}:`, err);
                container.innerHTML = `
                        <div class="alert alert-danger">
                            <strong>Error:</strong> No se pudo cargar la página "${pagePath}".
                        </div>
                    `;
            });
    }, 300);
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        const label = this.querySelector('.nav-label')?.textContent.trim().toLowerCase();
        if (routes[label]) {
            e.preventDefault();
            loadContent(HTML_PATH + routes[label]);
        }
    });
});

loadContent(HTML_PATH + 'dashboard.html');


