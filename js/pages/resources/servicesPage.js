import * as UnitServiceController from "../../controllers/resources/ServicePageController/unitServiceController.js";
import * as ServiceController from "../../controllers/resources/ServicePageController/serviceController.js";
import * as Alerts from "../../../utils/alerts.js";
import * as Validations from "../../../utils/validations.js";
import { getAllServicesList } from "../../services/resources/serviceService.js";
import { getAllMeasureUnitList } from "../../services/measures/measureUnitService.js";
import { initAllServiceTabs } from "../../controllers/resources/ServicePageController/serviceInitController.js";

export async function render() {
  return `
<div class="container py-4" id="service-root">
    <h2 class="general-title">Servicios</h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" id="ServiceSearch" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#UnitServiceModal" id="addUnitService-kz">
                <i class="bi bi-plus-circle"></i> Añadir Unidad de Servicio
            </button>
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#ServiceModal" id="addService-kz">
                <i class="bi bi-plus-circle"></i> Añadir Servicio
            </button>
        </div>
    </div>
    <div class="modal fade" id="UnitServiceModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title">Unidad de Servicio</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form id="UnitServiceForm">
                    <div class="modal-body mx-3">
                        <div class="col-sm-6 d-none">
                            <label for="unitIdtxt" class="form-label">id</label>
                            <input id="unitIdtxt" type="text" class="form-control" placeholder="id">
                        </div>
                        <div class="mb-3">
                            <label for="unitServicetxt" class="form-label">Servicio</label>
                            <select id="unitServicetxt" class="form-select">
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="unidadServiciotxt" class="form-label">Unidad de medida</label>
                            <select id="unidadServiciotxt" class="form-select">
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="carbonFootprinttxt" class="form-label">Huella de carbono</label>
                            <input id="carbonFootprinttxt" type="number" class="form-control" required placeholder="Huella de carbono" step="0.01" min=0>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal fade" id="ServiceModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title">Servicio</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form id="ServiceForm">
                    <div class="modal-body mx-3">
                        <div class="col-sm-6 d-none">
                            <label for="serviceIdtxt" class="form-label">id</label>
                            <input id="serviceIdtxt" type="text" class="form-control" placeholder="id">
                        </div>
                        <div class="mb-3">
                            <label for="servicetxt" class="form-label">Nombre</label>
                            <input id="servicetxt" class="form-control" required type="text" placeholder="Nombre del servicio" pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" title="Solo se permiten letras y espacios" maxlength="200"></input>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <ul class="nav nav-tabs mb-3" id="tabList"></ul>
    <div class="tab-content" id="tabContent-Services">
        <div class="tab-pane fade show active" id="unitServiceTab">
            <!-- Tabla de unidades de servicios -->
            <div id="tabContent"></div>
            <!-- Paginación -->
            <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                <div class="col-auto d-flex justify-content-start">
                    <select class="form-select" aria-label="Items por pagina" id="itemsSelectUnitService">
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="col d-flex justify-content-end">
                    <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                        <ul class="pagination mb-0" id="unitServicePagination">
                        </ul>
                    </nav>
                </div>
            </div>
        </div>    
        <div class="tab-pane fade" id="serviceTab">
            <!-- Tabla de servicios -->
            <div id="tabContentService"></div>
            <!-- Paginación -->
            <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                <div class="col-auto d-flex justify-content-start">
                    <select class="form-select" aria-label="Items por pagina" id="itemsSelectService">
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="col d-flex justify-content-end">
                    <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                    <ul class="pagination mb-0" id="servicePagination">
                    </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>    
</div>
  `;
}

export async function afterRender() {
  ///Aca mandamos a llamar el init de userController que es el que llena la tabla, por eso le pasamos container
  const container = document.getElementById("service-root");
  initAllServiceTabs(container);

  ///Obtenemos los servicios
  let service = await getAllServicesList();
  ///Obtenemos las unidades de medida
  let idMeasureUnit = await getAllMeasureUnitList();

  ///Obtenemos nuestros elementos
  const addUnitServiceBtn = document.querySelector("#addUnitService-kz");
  const serviceSelect = document.querySelector("#unitServicetxt");
  const measureUnitSelect = document.querySelector("#unidadServiciotxt");
  const carbonFootprinttxt = document.querySelector("#carbonFootprinttxt");
  const unitServiceForm = document.querySelector("#UnitServiceForm");
  const modalEl = document.getElementById("UnitServiceModal");
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const idHideen = document.querySelector("#unitIdtxt");

  ///Aca mandamos a llenar el loadServices y le pasamos los roles que hemos obtenido asi como el formselect
  UnitServiceController.loadService(service, serviceSelect);
  ///Aca mandamos a llenar el loadMeasureUnit y le pasamos los roles que hemos obtenido asi como el formselect
  UnitServiceController.loadMeasureUnit(idMeasureUnit, measureUnitSelect);

  ///Aca definimos que si el boton existe, al hacerle click vamos a limpiar los campos al cargar
  if (addUnitServiceBtn) {
    addUnitServiceBtn.addEventListener("click", () => {
      idHideen.value = "";
      serviceSelect.selectedIndex = 0;
      measureUnitSelect.selectedIndex = 0;
      carbonFootprinttxt.value = "";
    });
  }

  carbonFootprinttxt.addEventListener("keypress", (e) =>
    Validations.numberValidation(e)
  );

  let isUnitServiceLoading = false;
  ///Aca ya vinculamos la parte del insert/update con el submit de nuestro formulario, pasamos datos segun sean solicitados
  unitServiceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (carbonFootprinttxt.value <= 0) {
      Alerts.showToastCloseError(
        "El valor de la huella de carbono no puede ser menor o igual a cero"
      );
      return;
    }

    if (isUnitServiceLoading) return;
    isUnitServiceLoading = true;
    let res;
    if (idHideen.value) {
      res = await UnitServiceController.updateService(
        serviceSelect,
        measureUnitSelect,
        carbonFootprinttxt,
        unitServiceForm,
        idHideen
      );
    } else {
      res = await UnitServiceController.insertService(
        serviceSelect,
        measureUnitSelect,
        carbonFootprinttxt,
        unitServiceForm
      );
    }

    bsModal.hide();
    isUnitServiceLoading = false;
    idHideen.value = "";
    ///Si la respueta que nos retorna ya sea updateUser o insertUser es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
    if (res?.ok) {
      await UnitServiceController.reload(container);
    }
  });

  // Lógica de Servicios
  const addServiceBtn = document.querySelector("#addService-kz");
  const servicetxt = document.querySelector("#servicetxt");
  const serviceId = document.querySelector("#serviceIdtxt");
  const serviceForm = document.querySelector("#ServiceForm");
  const serviceModalE = document.querySelector("#ServiceModal");
  const bsServiceModal = bootstrap.Modal.getOrCreateInstance(serviceModalE);

  if (addServiceBtn) {
    addServiceBtn.addEventListener("click", () => {
      serviceId.value = "";
      servicetxt.value = "";
    });
  }

  // Validaciones para el modal de Servicios
  servicetxt.addEventListener("keypress", (e) => Validations.textValidation(e));

  // Se le da funcionalidad al formulario para agregar y actualizar
  let isServiceLoading = false;
  serviceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!servicetxt.value.trim()) {
      Alerts.showToastCloseError(
        "El nombre del servicio es obligatorio"
      );
      return;
    }

    if (isServiceLoading) return;
    isServiceLoading = true;
    
    let res;
    if (serviceId.value) {
      res = await ServiceController.updateService(
        servicetxt,
        serviceForm,
        serviceId
      );
    } else {
      res = await ServiceController.insertService(servicetxt, serviceForm);
    }

    bsServiceModal.hide();
    isServiceLoading = false;
    serviceId.value = "";
    ///Si la respueta que nos retorna ya sea updateUser o insertUser es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
    if (res?.ok) {
      await ServiceController.reload(container);
    }
  });

  // ---- Lógica de la búsqueda ----
  const serviceSearch = document.querySelector("#ServiceSearch");

  serviceSearch.addEventListener("keypress", (e) =>
    Validations.textValidation(e)
  );

if (serviceSearch) {
  serviceSearch.addEventListener("keyup", async (e) => {
    if (e.key === "Enter" || serviceSearch.value == "") {
      // Medidas
      if (document.querySelector("#unitServiceTab").classList.contains("show")) {
        UnitServiceController.setCurrentPage(0);
        await UnitServiceController.reload(container);
      }
      // Unidades
      if (document.querySelector("#serviceTab").classList.contains("show")) {
        ServiceController.setCurrentPage(0);
        await ServiceController.reload(container);
      }
    }
  });
}

  // ---- Mostrar solo botón de la pestaña activa ----
  addUnitServiceBtn.style.display = "block";
  addServiceBtn.style.display = "none";
  document.querySelectorAll("#tabList .nav-link").forEach((tab) => {
    tab.addEventListener("shown.bs.tab", (event) => {
      const target = event.target.getAttribute("href");
      addUnitServiceBtn.style.display =
        target === "#unitServiceTab" ? "block" : "none";
      addServiceBtn.style.display = target === "#serviceTab" ? "block" : "none";
    });
  });
}
