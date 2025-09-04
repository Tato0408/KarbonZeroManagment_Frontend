// measureUnitController.js
import * as MeasureUnitService from "../../services/measures/measureUnitService.js";
import * as MeasureService from "../../services/measures/measureService.js";
import * as Alerts from "../../../utils/alerts.js";

let currentPage = 0;
let currentSize = 10;
let measureMap = {};

export function setCurrentPage(page) {
  currentPage = page;
}

export function setPageSize(size) {
  currentSize = size;
}

// Inicializar tabla
export async function initUnit(container) {
  await loadMeasureMap();
  await renderData(container);
}

// Recargar tabla
export async function reloadUnit(container) {
  if (!container) return;

  try {
    const searchUnit =
      document.querySelector("#findMeasure")?.value.trim() || "";
    let data;
    if (!searchUnit) {
      data = await MeasureUnitService.getUnits(currentPage, currentSize);
    } else {
      data = await MeasureUnitService.getUnitByName(
        searchUnit,
        currentPage,
        currentSize
      );
    }

    const tab = container.querySelector("#tab-ContentUnit");
    loadTable(data.content, tab);
    renderPagination(data.number, data.totalPages, container);
  } catch (err) {
    console.error(err);
  }
}

async function loadMeasureMap() {
  const measuresData = await MeasureService.getMeasure(0, 1000);
  measureMap = {};
  if (measuresData && measuresData.content) {
    measuresData.content.forEach((m) => {
      measureMap[m.idMeasure] = m.nameMeasure;
    });
  }

  const select = document.getElementById("selectMeasureUnit");
  if (select) {
    Object.entries(measureMap).forEach(([id, name]) => {
      select.innerHTML += `<option value="${id}">${name}</option>`;
    });
  }
}
async function renderData(container) {
  const tab = container.querySelector("#tab-ContentUnit");
  if (!tab) return;

  let data;
  try {
    data = await MeasureUnitService.getUnits(currentPage, currentSize);
  } catch (err) {
    console.error(err);
    tab.innerHTML = `<p class="text-danger">No se pudo cargar las unidades de medida.</p>`;
    return;
  }

  const units = Array.isArray(data.content) ? data.content : [];
  loadTable(units, tab);
  renderPagination(data.number, data.totalPages, container);
}
function loadTable(units, tab) {
  const baseIndex = currentPage * currentSize;
  tab.innerHTML = `
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Medida</th>
                    <th>Unidad de medida</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${units
                  .map(
                    (u, i) => `
                <tr>
                    <td>${baseIndex + i + 1}</td>
                    <td>${measureMap[u.idMeasure] || "Desconocido"}</td>
                    <td>${u.nameMeasureUnit}</td>
                    <td>
                        <button class="btn btn-sm btn-success me-1 btn-edit-unit" data-id="${
                          u.idMeasureUnit
                        }" data-bs-toggle="modal" data-bs-target="#UnidadModal">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-delete-unit" data-id="${
                          u.idMeasureUnit
                        }">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>`
                  )
                  .join("")}
            </tbody>
        </table>
    </div>`;
  tab.querySelectorAll(".btn-edit-unit").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const unit = await MeasureUnitService.getUnitById(id);
      if (!unit) return;

      document.getElementById("unidadTxt").value = unit.nameMeasureUnit;
      document.getElementById("idUnidad").value = unit.idMeasureUnit;
      document.getElementById("selectMeasureUnit").value = unit.idMeasure || "";
    });
  });
  tab.querySelectorAll(".btn-delete-unit").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const ok = await MeasureUnitService.deleteUnit(id);
      if (ok) reloadUnit(tab.closest("#measures-root"));
    });
  });
}
export async function insertUnit(nameInput, form) {
  const measureId = document.getElementById("selectMeasureUnit")?.value || "";
  if (!nameInput.value.trim() || !measureId) {
    Alerts.showToastCloseError("Debe completar todos los campos");
    return;
  }

  const payload = {
    nameMeasureUnit: nameInput.value.trim(),
    idMeasure: measureId,
  };
  const res = await MeasureUnitService.insertUnit(payload);
  form.reset();
  return res;
}
export async function updateUnit(nameInput, idHidden, form) {
  const measureId = document.getElementById("selectMeasureUnit")?.value || "";
  if (!nameInput.value.trim() || !measureId) {
    Alerts.showToastCloseError("Debe completar todos los campos");
    return;
  }

  const payload = {
    nameMeasureUnit: nameInput.value.trim(),
    idMeasure: measureId,
  };
  const res = await MeasureUnitService.updateUnit(payload, idHidden.value);
  form.reset();
  return res;
}

function renderPagination(current, totalPages, container) {
  const pagination = container.querySelector("#unitPagination");
  if (!pagination) return;
  pagination.innerHTML = "";

  const prev = document.createElement("li");
  prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
  prev.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
  prev.addEventListener("click", (e) => {
    e.preventDefault();
    if (current > 0) {
      currentPage--;
      initUnit(container);
    }
  });
  pagination.appendChild(prev);

  for (let i = 0; i < totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === current ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage !== i) {
        currentPage = i;
        initUnit(container);
      }
    });
    pagination.appendChild(li);
  }

  const next = document.createElement("li");
  next.className = `page-item ${current >= totalPages - 1 ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
  next.addEventListener("click", (e) => {
    e.preventDefault();
    if (current < totalPages - 1) {
      currentPage++;
      initUnit(container);
    }
  });
  pagination.appendChild(next);
}
