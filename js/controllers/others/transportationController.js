import * as transportService from '../../services/others/transportationService.js';
import * as Alerts from '../../../utils/alerts.js'

export async function init(container) {
  renderData(container);
}

let currentPage = 0;
let currentSize = 10;

///Aca esta nuestro metodo reload y pues container sera igual al contenedor que le estemos pasando
export async function reload(container) {
  ///Si nuestro container es nulo....
  if (!container) return;
  ///Si no pues hacemos una peticion get y le pasamos ese array de transporte + el tab donde queremos poner la grid
  try {
    const TransportName = document.querySelector("#TransportSearch");
    const searchName = TransportName.value.trim();
    let data;
    if (!searchName) {
          data = await transportService.getTransport(currentPage, currentSize);
    } else {
      data = await transportService.getAllTransportByName(searchName, currentPage, currentSize);
    }
    const transport = data.content;
    const $tabContent = container.querySelector('#tabContent');
    loadTransportTable(transport, $tabContent);
    ///Llamamos a renderPagination para que siempre vaya cambiando en base a la pagina y numero en el cual se encuentre al hacer reload
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
  let transport = [];

  ///Llenamos los servicios
  try {
    ///traemos el json en data
    const data = await transportService.getTransport(currentPage, currentSize);
    ///Accedemos al content de eso 
    transport = data.content;
    ///Llamamos al renderPagination para que carge cuando inicie todo
    renderPagination(data.number, data.totalPages, container)
  } catch (error) {
    console.error(error);
    return container.innerHTML = `<p class="text-danger">No se pudieron cargar los transportes.</p>`;
  }

  ///Aca definimos nuestros tabs y de igual forma a donde estan dirigidos, puedes definir varios en page, y cada uno debe tener su div con ru ID 
  $tabList.innerHTML = `
        <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#transporte">Transporte</a>
        </li>`;

  ///Cargamos datos, pasamos nuestros transportes y nuestro contenedor
  loadTransportTable(transport, $tabContent);

  const sizeSelector = document.getElementById("itemsSelectTransport");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reload(container);
  });

  ///Aca definimos que hace nuestro boton de eliminar
  container.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-delete-transport');
    if (!btn) return;
    const id = btn.dataset.id;
    const ok = await transportService.deleteTransport(id);
    ///En caso de que nos devuelva un true recargamos
    if (ok) await reload(container);
  });

  ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
  container.addEventListener('click', async e => {
    const editBtn = e.target.closest('.btn-edit-transport');
    if (!editBtn) return;
    const id = editBtn.dataset.id;
    try {
      const transport = await transportService.getTransportById(id);
      document.getElementById('idtxt').value = transport.idTransport ?? '';
      document.getElementById('nombretxt').value = transport.name ?? '';
      document.getElementById('huellacarbontxt').value = transport.carbonFootprint ?? '';
    } catch (err) {
      Alerts.showToastCloseError('No se pudo cargar el transporte');
      console.error(err);
    }
  });
}

///Aca cargamos nuestros transportes, nada nuevo, eso si en lugar del id mandamos un numero, por que pues si, usamos RAW, xdnt
export function loadTransportTable(transport, tab) {
  ///EL base index nos sirve para que siempre se guarden las filas que llevamos en pase a la pagina y su tamaño
  const baseIndex = currentPage * currentSize;
  tab.innerHTML = "";
  tab.innerHTML = `
    <div id="transport" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Huella de carbono</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerTransport">
            ${transport
              .map(
                (t, i) => `
              <tr>
                <td>${baseIndex + i + 1}</td>
                <td>${t.name}</td>
                <td>${t.carbonFootprint}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-transport" data-id="${
                      t.idTransport
                    }" data-bs-toggle="modal" data-bs-target="#TransportModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-transport" data-id="${
                      t.idTransport
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

export async function insertTransport(nametxt, carbonFootprinttxt, form) {
  const payload = {
    name: nametxt.value.trim(),
    carbonFootprint: parseFloat(carbonFootprinttxt.value.trim())
  }
  try {
    const res = await transportService.insertTransport(payload);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo agregar al Transporte ${err}`);
    ///Retornamos un false
    return { ok: false };
  }
}

export async function updateTransport(nametxt, carbonFootprinttxt, form, id) {
  const payload = {
    name: nametxt.value.trim(),
    carbonFootprint: parseFloat(carbonFootprinttxt.value.trim())
  }
  try {
    ///Hacemos la peticion
    const res = await transportService.updateTransport(payload, id);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError("No se pudo actualizar el transporte");
    ///Retornamos un false
    return { ok: false };
  }
}

export function renderPagination(current, totalPages, container) {
  ///Aca accedemos a nuestro ul de pagination
  const pagination = document.getElementById("transportPagination");
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