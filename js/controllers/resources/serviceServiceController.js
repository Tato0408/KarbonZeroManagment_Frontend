import * as ServiceService from '../../services/resources/serviceServiceService.js';
import * as Alerts from '../../../utils/alerts.js'
///Con import podemos acceder a todos los metodos exportados de X archivo

///Nuestro metodo de inicio, lo llamamos
export async function init(container) {
  ///Mandamos el contenedor junto con nuestro metodo init
  renderData(container);
}

let currentPage = 0;
let currentSize = 10;

///Aca esta nuestro metodo reload y pues container sera igual al contenedor que le estemos pasando en este caso el final en page va a ser el de servicios
export async function reload(container) {
    ///Si nuestro container es nulo....
    if (!container) return;
    ///Si no pues hacemos una peticion get y le pasamos ese array de services + el tab donde queremos poner la grid
    try {
          const ServiceSearch = document.querySelector("#ServiceSearch");
          const searchName = ServiceSearch.value.trim();

          let data;
          if (!searchName) {
            data = await ServiceService.getService(currentPage, currentSize);
          } else {
            data = await ServiceService.getAllMeasureUnitServiceByName(searchName, currentPage, currentSize);
          }
          const service = data.content;
          const $tabContent = container.querySelector('#tabContent');
          loadServiceTable(service, $tabContent);
          ///Llamamos a renderPagination para que siempre pues vaya cambiando en base a la pagina y numero en el cual se encuentre al hacer reload
          renderPagination(data.number, data.totalPages, container);  
    } catch (e) {
        console.error(e);
    }
}

///Funcion para renderizar los datos asi como los eventos de nuestro formulario
async function renderData(container) {
  ///Variables con nuestro tabList y el contenido(nuestra tabla)
  const $tabList = container.querySelector('#tabList');
  const $tabContent = container.querySelector('#tabContent');
  ///Array donde se guardan los usuarios
  let services = [];

  ///Llenamos los servicios
  try {
    ///traemos el json en data
    const data = await ServiceService.getService(currentPage, currentSize);
    ///Accedemos al content de eso 
    services = data.content;
    ///Llamamos al renderPagination para que carge cuando inicie todo
    renderPagination(data.number, data.totalPages, container)
  } catch (error) {
    console.error(error);
    return container.innerHTML = `<p class="text-danger">No se pudieron cargar los servicios.</p>`;
  }

  ///Aca definimos nuestros tabs y de igual forma a donde estan dirigidos, puedes definir varios en page, y cada uno debe tener su div con su ID 
  $tabList.innerHTML = `
        <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#service">Servicios</a>
        </li>`;

  ///Cargamos datos, pasamos nuestros servicios y nuestro contenedor
  loadServiceTable(services, $tabContent);

  const sizeSelector = document.getElementById("itemsSelectService");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reload(container);
  });

  ///Aca definimos que hace nuestro boton de eliminar
  container.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-delete-service');
    if (!btn) return;
    const id = btn.dataset.id;
    const ok = await ServiceService.deleteService(id);
    ///En caso de que nos devuelva un true recargamos
    if (ok) await reload(container);
  });

  ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
  container.addEventListener('click', async e => {
    const editBtn = e.target.closest('.btn-edit-service');
    if (!editBtn) return;
    const id = editBtn.dataset.id;
    try {
      const service = await ServiceService.getServiceById(id);
      document.getElementById('idtxt').value = service.idMeasureUnitService ?? '';
      document.getElementById('servicetxt').value = service.idService ?? '';
      document.getElementById('unidadServiciotxt').value = service.idMeasureUnit ?? '';
      document.getElementById('carbonFootprinttxt').value = service.carbonFootprint ?? '';
    } catch (err) {
      Alerts.showToastCloseError('No se pudo cargar el servicio');
      console.error(err);
    }
  });
}

///Aca cargamos nuestros servicios, nada nuevo, eso si en lugar del id mandamos un numero, por que pues si, usamos RAW, xdnt
export function loadServiceTable(services, tab) {
  ///EL base index nos sirve para que siempre se guarden las filas que llevamos en pase a la pagina y su tamaño
  const baseIndex = currentPage * currentSize;
  tab.innerHTML = "";
  tab.innerHTML = `
    <div id="usuarios" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Servicio</th>
                <th>Unidad de medida</th>
                <th>Huella de carbono</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerUsers">
            ${services
              .map(
                (s, i) => `
              <tr>
                <td>${baseIndex + i + 1}</td>
                <td>${s.serviceName}</td>
                <td>${s.measureUnitName}</td>
                <td>${s.carbonFootprint}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-service" data-id="${
                      s.idMeasureUnitService
                    }" data-bs-toggle="modal" data-bs-target="#ServiceModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-service" data-id="${
                      s.idMeasureUnitService
                    }"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

///Aca llenamos nuestros Servicios, la funcionalidad esta en page
export function loadService(service, serviceSelect) {
  service.forEach(element => {
    serviceSelect.innerHTML += `
        <option value="${element.idService}">${element.name}</option>
      `
  });
}

///Aca llenamos nuestras unidades de medida, la funcionalidad esta en page
export function loadMeasureUnit(idMeasureUnit, measureUnitSelect) {
  idMeasureUnit.forEach(element => {
    measureUnitSelect.innerHTML += `
        <option value="${element.idMeasureUnit}">${element.nameMeasureUnit}</option>
      `
  });
}

///!IMPORTANTE: con el tema de los idfk nosotros aca usamos el .value, en el page, pasamos el select entero
///Aca hacemos la funcionalidad del insert, su uso esta en page
export async function insertService(idService, idMeasureUnit, carbonFootprinttxt, form) {
  const payload = {
    idService: idService.value,
    idMeasureUnit: idMeasureUnit.value,
    carbonFootprint: parseFloat(carbonFootprinttxt.value.trim())
  }
  try {
    const res = await ServiceService.insertService(payload);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo agregar el servicio ${err}`);
    ///Retornamos un false
    return { ok: false };
  }
}

///Lo mismo que el insert pero ahora update,
export async function updateService(idService, idMeasureUnit, carbonFootprinttxt, form, id) {
  const payload = {
    idService: idService.value,
    idMeasureUnit: idMeasureUnit.value,
    carbonFootprint: parseFloat(carbonFootprinttxt.value.trim())
  }
  try {
    ///Hacemos la peticion
    const res = await ServiceService.updateService(payload, id);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError("No se pudo actualizar el Servicio");
    ///Retornamos un false
    return { ok: false };
  }
}

export function renderPagination(current, totalPages, container) {
  ///Aca accedemos a nuestro ul de pagination
  const pagination = document.getElementById("servicePagination");
  if (!pagination) return;
  pagination.innerHTML = "";///Limpiamos la paginacion previa


  ///Este es el boton para ir en retroseso
  const prev = document.createElement("li");
  prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
  prev.innerHTML = ` <a class="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                     </a>`;
  ///Este es su evento
  prev.addEventListener("click", (e) => {
    e.preventDefault();
    if (current > 0) {
      currentPage = current - 1;///Retrocede una pagina
      ///Hacemos reload
      reload(container);
    }
  });
  pagination.appendChild(prev);

  ///Aca controlamos el numero de paginas en base a totalPages
  for (let i = 0; i < totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === current ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage !== i) {
        currentPage = i; ///Saltamos a la pagina seleccionada
        reload(container);
      }
    });
    pagination.appendChild(li);
  }

  ///Boton siguiente
  const next = document.createElement("li");
  next.className = `page-item ${current >= totalPages - 1 ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>`;
  next.addEventListener("click", (e) => {
    e.preventDefault();
    if (current < totalPages - 1) {
      currentPage = current + 1;///Avanza una pagina
      reload(container);
    }
  });
  pagination.appendChild(next);
}
export async function setCurrentPage(page) {
  currentPage = page;
}