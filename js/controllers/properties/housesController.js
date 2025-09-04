import * as LivingSpaceService from "../../services/properties/houseService";
import * as Alerts from "../../../utils/alerts";

export async function LivingInit(container) {
  try {
    renderData(container);
  } catch (err) {
    console.log("Error : ", err);
  }
}

let currentPage = 0;
let currentSize = 10;
export async function setCurrentPage(page) {
  currentPage = page;
}

//Metodo reload y el container sera igual al contenedor que le estemos pasando, en este caso el final en page va a ser el de house

export async function reloadHouse(container) {
  //Si el container es nulo
  if (!container) return;

  //Si no hacemos un Get y le pasamos el array del alimento y el tab que queremos agregarle al grid
  try {
    const search = document.querySelector("#searchHouse");
    const searchHouse = search.value;
    let data;
    if (!searchHouse) {
      data = await LivingSpaceService.getLivingSpaceTypes(
        currentPage,
        currentSize
      );
    } else {
      data = await LivingSpaceService.getLivingSpaceTypeByName(
        searchHouse,
        currentPage,
        currentSize
      );
    }

    const house = data.content;
    const $tabContent = container.querySelector("#tabContent");
    LoadTable(house, $tabContent);

    renderPagination(data.number, data.totalPages, container);
  } catch (err) {
    console.error(e);
  }
}

async function renderData(container) {
  let house = [];
  //Llenamos el alimento
  try {
    const data = await LivingSpaceService.getLivingSpaceTypes(
      currentPage,
      currentSize
    );

    house = data.content;
  } catch (err) {
    console.log("ERROR: ", err);
    return (container.innerHTML = `<p class="text-danger">No se pudieron cargar los recursos.</p>`);
  }

  const tab = container.querySelector("#tabContent");
  if (!tab) {
    console.error("No se encontró #tabContent dentro del container");
    return;
  }
  const $tabList = container.querySelector("#tabList");
  $tabList.innerHTML = `
    <li class="nav-item d-flex">
        <a class="nav-link active" data-bs-toggle="tab" href="viviendas">Tipos de viviendas</a>
    </li>
    `;
  LoadTable(house, tab);
  const sizeSelector = document.getElementById("itemsSelect");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value);
    currentPage = 0;
    reloadHouse(container);
  });

  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-delete-house");
    if (!btn) return;
    const id = btn.dataset.id;
    const ok = await LivingSpaceService.deleteLivingSpaceTypes(id);
    //En caso de que duvuelva true retornamos
    if (ok) await reloadHouse(container);
  });

  ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
  container.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".btn-edit-house");
    if (!editBtn) return;
    const id = editBtn.dataset.id;
    try {
      const house = await LivingSpaceService.getLivingSpaceTypeById(id);
      document.getElementById("idtxt").value = house.idLivingSpaceType ?? "";
      document.getElementById("nombretxt").value =
        house.nameLivingSpaceType ?? "";
      document.getElementById("huellacarbontxt").value =
        house.carbonFootPrint ?? "";
    } catch (err) {
      Alerts.showToastCloseError("No ha sido posible cargar los alimentos");
      console.error(err);
    }
  });
}

export function LoadTable(house, tab) {
  ///EL base index nos sirve para que siempre se guarden las filas que llevamos en pase a la pagina y su tamaño
  const baseIndex = currentPage * currentSize;
  tab.innerHTML = "";
  tab.innerHTML = ` 
    <div id="viviendas" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Tipo de vivienda</th>
                <th>Huella de Carbono</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerHouse">
            ${house
              .map(
                (u, i) => `
              <tr>
                <td>${baseIndex + i + 1}</td>
                <td>${u.nameLivingSpaceType}</td>
                <td>${u.carbonFootPrint}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-house" data-id="${
                      u.idLivingSpaceType
                    }" data-bs-toggle="modal" data-bs-target="#viviendaModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-house" data-id="${
                      u.idLivingSpaceType
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

export async function insertLivingSpaceType(
  nombreTipoVivienda,
  huellaCarbono,
  form
) {
  const playload = {
    nameLivingSpaceType: nombreTipoVivienda.value.trim(),
    carbonFootPrint: huellaCarbono.value.trim(),
  };
  try {
    const res = await LivingSpaceService.insertLivingSpaceTypes(playload);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pudo agregar el tipo de vivienda ${err}`);

    return { ok: false };
  }
}

export async function updateLivingSpaceType(
  nombreTipoVivienda,
  huellaCarbono,
  form,
  idtxt
) {
  const playload = {
    idLivingSpaceType: idtxt.value,
    nameLivingSpaceType: nombreTipoVivienda.value.trim(),
    carbonFootPrint: huellaCarbono.value.trim(),
  };
  try {
    const res = await LivingSpaceService.updateLivingSpaceTypes(
      playload,
      idtxt
    );
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pueden actualizar los datos ${err}`);
    console.log(err);
    ///Retornamos un false
    return { ok: false };
  }
}

export function renderPagination(current, totalPages, container) {
  //Acá accedemos al ul de paginación
  const pagination = document.getElementById("housePagination");
  if (!pagination) return;
  pagination.innerHTML = "";

  const prev = document.createElement("li");
  prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
  prev.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;

  prev.addEventListener("click", (e) => {
    e.preventDefault();
    if (current > 0) {
      currentPage = current - 1;

      reloadHouse(container);
    }
  });

  pagination.appendChild(prev);

  for (let i = 0; i < totalPages; i++) {
    const li = document.createElement("li");
    li.className = ` page-item ${i === current ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage !== i) {
        currentPage = i;
        reloadHouse(container);
      }
    });
    pagination.appendChild(li);
  }

  const next = document.createElement("li");
  next.className = `page-item ${current >= totalPages - 1 ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link" href="#" aria-label="Next">
                       <span aria-hidden="true">&raquo;</span>
                     </a>`;
  next.addEventListener("click", (e) => {
    e.preventDefault();
    if (current < totalPages - 1) {
      currentPage = current + 1;
      reloadHouse(container);
    }
  });
  pagination.appendChild(next);
}
