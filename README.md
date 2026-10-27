# KarbonZero — Panel Web de Gestión

> Panel de administración de **KarbonZero**: desde aquí el equipo administrador mantiene los **catálogos globales** con los que se calcula la huella de carbono de los usuarios (medidas, vehículos, alimentos, servicios, viviendas, mascotas, transportes y países) y gestiona usuarios, administradores y **empresas** afiliadas.

---

## Contenido

- [Descripción](#descripción)
- [Ecosistema KarbonZero](#ecosistema-karbonzero)
- [Autores](#autores)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Librerías principales y su función](#librerías-principales-y-su-función)
- [Convenciones de nomenclatura](#convenciones-de-nomenclatura)
- [Rutas del panel](#rutas-del-panel)
- [Configuración de la API](#configuración-de-la-api)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Solución de problemas comunes](#solución-de-problemas-comunes)

---

## Descripción

Aplicación web (SPA con **JavaScript puro + Vite + Bootstrap**) que consume la API central ([KarbonZero_BackendMobile](https://github.com/Tato0408/KarbonZero_BackendMobile)). Tiene dos páginas de entrada: `login.html` (inicio de sesión y recuperación de contraseña) e `index.html` (el panel), protegido por sesión.

Módulos del panel:

- **Medidas** — Medidas y unidades de medida.
- **Propiedades**
  - **Vehículos** — Tamaños de vehículo y tipos de combustible.
  - **Viviendas** — Tipos de vivienda.
  - **Mascotas** — Tipos de mascota.
- **Recursos**
  - **Alimentos** — Alimentos y categorías de alimentos.
  - **Servicios** — Servicios (agua, luz, gas…) y sus unidades.
- **Otros**
  - **Empresas** — Empresas afiliadas, su API Key y su canal.
  - **Países** — Países disponibles en el registro de usuarios.
  - **Transporte** — Medios de transporte.
  - **Usuarios** — Usuarios de la app y administradores del sistema (alta, edición y deshabilitar).

Todos los formularios validan los campos en el cliente (`utils/validations.js`) antes de enviarlos a la API.

---

## Ecosistema KarbonZero

| Repositorio | Función | Consume |
|---|---|---|
| [KarbonZero_BackendMobile](https://github.com/Tato0408/KarbonZero_BackendMobile) | API central: app móvil, panel de gestión, empresas y canales | Oracle Database (`Database/KarbonZero.sql`) |
| [KarbonZero_Backend](https://github.com/Tato0408/KarbonZero_Backend) | API institucional de una empresa (consumo de recursos y CO₂) | Su propia BD (`Database/KarbonZeroInstitucional.sql`) + la API central |
| [KarbonZero_Frontend](https://github.com/Tato0408/KarbonZero_Frontend) | Panel web institucional de la empresa | API institucional + API central (mapa) |
| **KarbonZeroManagment_Frontend** _(este)_ | Panel web de gestión (administradores) | API central |
| [KarbonZero_FrontendMobile](https://github.com/Tato0408/KarbonZero_FrontendMobile) | App móvil del usuario final (Framework7 + Capacitor) | API central |

### Ejecución local

Ninguno de los proyectos tiene actualmente un despliegue público activo: el ecosistema completo está preparado para ejecutarse en local. Puertos por defecto:

| Servicio | Repositorio | URL local |
|---|---|---|
| Base de datos (Oracle XE, `XEPDB1`) | Scripts en `KarbonZero_BackendMobile/Database` y `KarbonZero_Backend/Database` | `localhost:1521` |
| API central | KarbonZero_BackendMobile | http://localhost:8080 |
| API institucional | KarbonZero_Backend | http://localhost:8081 |
| Panel de gestión | KarbonZeroManagment_Frontend | http://localhost:5173 |
| Panel institucional | KarbonZero_Frontend | http://localhost:5174 |
| App móvil (navegador) | KarbonZero_FrontendMobile | http://localhost:5175 |

Orden de arranque: **base de datos → API central → API institucional → frontends**.

Cuentas de demostración incluidas en los scripts (contraseña `KarbonZero2026!` en todas):

| Dónde | Correo | Permisos |
|---|---|---|
| Panel de gestión | `gerardoajf@karbonzero.local` | Administrador (`status` 1) |
| App móvil | `freddy@karbonzero.local` | Usuario de la app |
| Panel institucional | `freddy@karbonzero.local` | Lectura y escritura (rol *Coordinador de finanzas*) |
| Panel institucional | `tato@karbonzero.local` | Solo lectura (rol *Coordinador de medio ambiente*) |

---

## Autores

| # | Autor | GitHub |
|---|-------|--------|
| 1 | Oscar Abel Velásquez Joyar | [@OscarAVJ](https://github.com/OscarAVJ) |
| 2 | Camila Mariana Quinteros Gómez | [@camila-mariana](https://github.com/Camila-mariana) |
| 3 | Freddy Ricardo Pérez Alvarenga | [@Tato0408](https://github.com/Tato0408) |
| 4 | Joshua Gilberto Marinero Hernández | [@Joshuaz](https://github.com/Joshuaz) |
| 5 | Gerardo Andrés Jovel Franco | [@GerardoAJF](https://github.com/GerardoAJF) |
| 6 | Edwin Geovanni Alfaro Alfaro | [@EdwinAlfaro123](https://github.com/EdwinAlfaro123) |

---

## Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Lenguaje** | HTML, CSS y JavaScript (ES Modules), sin framework |
| **Bundler / servidor de desarrollo** | Vite 7 (dos entradas: `index.html` y `login.html`) |
| **UI** | Bootstrap 5.3, Bootstrap Icons, Iconify, fuente Josefin Sans |
| **Alertas** | SweetAlert2 |
| **Despliegue** | Vercel |

---

## Requisitos previos

| Herramienta | Para qué |
|---|---|
| Node.js 18+ y npm | Instalar y correr Vite |
| Conexión a internet | Bootstrap, Iconify y SweetAlert2 se cargan desde CDN |
| API central en ejecución (local o desplegada) y un usuario administrador | Datos del panel e inicio de sesión |

---

## Arquitectura del Proyecto

```
KarbonZeroManagment_Frontend/
├── index.html                          # Panel (SPA protegida)
├── login.html                          # Inicio de sesión y recuperación de contraseña
├── css/                                # index, layout, login y grids globales
├── img/                                # Ícono e imágenes
├── js/
│   ├── app.js / layout.js              # Inicialización del panel y del menú lateral
│   ├── routes.js                       # Router por hash (#measures, #vehicles, ...) con guard de sesión
│   ├── index.js / login.js             # Puntos de entrada de cada página
│   ├── pages/                          # Una página por ruta
│   │   ├── measuresPage.js
│   │   ├── properties/                 # vehicles, houses, pets
│   │   ├── resources/                  # food, services
│   │   └── others/                     # companies, countries, transportation, users
│   ├── controllers/                    # Lógica de cada vista, misma agrupación que pages/
│   └── services/                       # Llamadas fetch a la API, misma agrupación que pages/
├── utils/
│   ├── api_url.js                      # URL de la API central
│   ├── alerts.js                       # Helpers de SweetAlert2
│   └── validations.js                  # Validaciones de campos (solo letras, números, etc.)
├── vite.config.js
└── package.json
```

> **Nota:** el proyecto sigue un patrón **Page → Controller → Service**, y las tres capas se agrupan en las mismas carpetas de dominio (`properties/`, `resources/`, `others/`), igual que el menú del panel.

---

## Librerías principales y su función

| Librería | Uso |
|----------|-----|
| `vite` _(dev)_ | Servidor de desarrollo y build de producción |
| `bootstrap` + `bootstrap-icons` _(CDN)_ | Layout, componentes (modales, tablas, formularios) e íconos |
| `iconify-icon` _(CDN)_ | Íconos adicionales del menú |
| `sweetalert2` _(CDN)_ | Alertas, confirmaciones y notificaciones |

---

## Convenciones de nomenclatura

| Convención | Dónde se usa |
|---|---|
| `camelCase` + sufijo | Archivos y módulos: `xxxPage.js`, `xxxController.js`, `xxxService.js`. |
| `xxxInitController.js` | Controlador que inicializa una vista con varias pestañas (ej. vehículos, usuarios, alimentos) y delega en los controladores de cada pestaña. |
| `camelCase` | Funciones y variables. |
| `UPPER_SNAKE_CASE` | URL base de la API (`APIURL`). |
| Hash en `camelCase` | Rutas del panel (`#measures`, `#vehicles`). |

---

## Rutas del panel

| Ruta | Vista |
|---|---|
| `#measures` _(por defecto)_ | Medidas y unidades |
| `#vehicles` | Tamaños de vehículo y combustibles |
| `#houses` | Viviendas |
| `#pets` | Mascotas |
| `#food` | Alimentos y categorías |
| `#services` | Servicios y unidades |
| `#companies` | Empresas |
| `#contries` | Países |
| `#transport` | Transporte |
| `#users` | Usuarios y administradores |

Si la sesión no es válida, el router redirige a `login.html`.

---

## Configuración de la API

La URL de la API central está en `utils/api_url.js` y se lee de la variable de entorno de Vite `VITE_API_URL`, con la API local (`http://localhost:8080`) como valor por defecto.

Para apuntar a otra API, copia `.env.example` como `.env.local` (ya está en `.gitignore`):

```env
VITE_API_URL=http://localhost:8080
```

> A diferencia del panel institucional, aquí la URL va **sin** `/` al final, porque los servicios agregan la barra (`${API_URL}/apiAuth/login`).

---

## Ejecución del Proyecto

```bash
npm install
npm run dev          # http://localhost:5173
```

Build de producción:

```bash
npx vite build       # genera dist/
```

---

## Solución de problemas comunes

| Síntoma | Causa | Solución |
|---|---|---|
| Siempre redirige a `login.html` o el login rechaza al usuario | El usuario tiene `status` 0 (usuario de la app) o está deshabilitado, o la cookie `authToken` no llega a la API | Inicia sesión con un administrador y verifica que el origen esté permitido en `CorsConfig.java` de la API central |
| Error de CORS en la consola | El frontend no corre en `localhost` | Usa `npm run dev` (puerto 5173) o agrega el origen en `CorsConfig.java` de la API central |
| No se puede iniciar sesión / `Failed to fetch` | La API central no está corriendo en `http://localhost:8080` | Arranca la API central (ver [Ejecución local](#ejecución-local)) |
| Botones o íconos sin estilo | No cargaron las librerías por CDN | Verifica la conexión a internet o bloqueadores de contenido |

---

Este proyecto es de uso académico. Todos los derechos reservados.
