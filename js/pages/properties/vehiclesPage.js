import * as VehiclesController from "../../controllers/properties/vehiclesController/vehiclesController";
import * as FuelTypeController from "../../controllers/properties/vehiclesController/fuelTypeController";
import * as Alerts from "../../../utils/alerts.js";
import * as Validations from "../../../utils/validations.js";
import { getMeasureUnits } from "../../services/properties/fuelTypeService";
import { initAllVehiclesTabs } from "../../controllers/properties/vehiclesController/vehicelsInitController";

export async function render() {
  return `
<div class="container py-4" id="vehicles-root">
        <h2 class="general-title">
            Vehiculo
        </h2>
        <!-- filtros tipo de combustible -->
        <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
            <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
                <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control border-0 bg-transparent" id="searchVehicle"
                    placeholder="Buscar">
            </div>
            <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
                <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#CarModal" id="addCarSize">
                    <i class="bi bi-plus-circle"></i> Añadir Tamaño de Vehículo
                </button>
                <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#FuelModal" id="addFuelType">
                    <i class="bi bi-plus-circle"></i> Añadir Tipo de Combustible
                </button>
            </div>
        </div>
        <div class="modal fade" id="CarModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content kz-modal-mongo border-0">
                    <div class="modal-header" style="justify-content: center; position: relative;">
                        <h4 class="kz-modal-title" id="exampleModalLongTitle">Vehiculo</h4>
                        <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                            data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <form id="CarForm">
                        <div class="modal-body mx-3">
                            <div class="row g-2 mb-3">
                                <div class="col-sm-12">
                                    <label for="nombretxt" class="form-label">Nombre</label>
                                    <input id="nombretxt" required type="text" class="form-control" placeholder="Nombre">
                                </div>

                                <div class="col-sm-12 d-none">
                                    <label for="idtxt" class="form-label">Id</label>
                                    <input id="idtxt" type="text" class="form-control" placeholder="Id">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer d-flex justify-content-center">
                            <button type="submit" class="btn kz-button-create">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal fade" id="FuelModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content kz-modal-mongo border-0">
                    <div class="modal-header" style="justify-content: center; position: relative;">
                        <h4 class="kz-modal-title" id="exampleModalLongTitle">Tipo de Combustible</h4>
                        <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                            data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <form id="FuelForm">
                        <div class="modal-body mx-3">
                            <div class="row g-2 mb-3">
                                <div class="col-sm-6">
                                    <label for="nombretxtFuel" class="form-label">Nombre</label>
                                    <input id="nombretxtFuel" required type="text" class="form-control" placeholder="Nombre">
                                </div>
                                <div class="col-sm-6">
                                    <label for="huellatxt" class="form-label">Huella de Carbono</label>
                                    <input id="huellatxt" required type="number" class="form-control"
                                        placeholder="Huella de carbono" step="0.01" min=0>
                                </div>
                                <div class="row g-2 mb-2">
                                    <label for="unitSelect" class="form-label">Unidad de medida</label>
                                    <select id="unitSelect" class="form-select">
                                    </select>
                                </div>
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
        <div class="tab-content" id="tabContent">
            <!-- TAB TAMANO CARRO -->
            <div class="tab-pane fade show active" id="carSizeTab">
                <!-- contenido tamano -->
                <div id="tabContent-CarSize"></div>
                <!-- paginación tamano -->
                <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                    <div class="col-auto d-flex justify-content-start">
                        <select class="form-select" aria-label="Items por pagina" id="itemsSelectCar">
                            <option value="2">2</option>
                            <option value="5">5</option>
                            <option value="10" selected>10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                            <ul id="carSizePagination" class="pagination mb-0"></ul>
                        </nav>
                    </div>
                </div>
            </div>


            <!-- TAB TIPO DE COMBUSTIBLE -->
            <div class="tab-pane fade" id="FuelTypeTab">
                <!-- contenido tipo combustible -->
                <div id="tabContent-FuelType"></div>
                <!-- paginación tipo combustible -->
                <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                    <div class="col-auto d-flex justify-content-start">
                        <select class="form-select" aria-label="Items por pagina" id="itemsSelect">
                            <option value="2">2</option>
                            <option value="5">5</option>
                            <option value="10" selected>10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                            <ul id="FuelTypePagination" class="pagination mb-0"></ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;
}
export async function afterRender() {
  const container = document.getElementById("vehicles-root");
  const search = document.querySelector("#searchVehicle");

  await initAllVehiclesTabs(container);

  // Lógica de CarSizes Tab
  const addCarSizeBtn = container.querySelector("#addCarSize");
  const closeCarbtn = container.querySelector("#btnClose");
  const carSizeName = container.querySelector("#nombretxt");
  const idCarSize = container.querySelector("#idtxt");
  const carSizeModal = container.querySelector("#CarModal");
  const bsCarModal = bootstrap.Modal.getOrCreateInstance(carSizeModal);
  const carSizeForm = container.querySelector("#CarForm");

  if (addCarSizeBtn) {
    addCarSizeBtn.addEventListener("click", () => {
      idCarSize.value = "";
      carSizeName.value = "";
    });
  }
  if (closeCarbtn) {
    closeCarbtn.addEventListener("click", () => {
      idCarSize.value = "";
      carSizeName.value = "";
    });
  }

  // Validaciones para textbox
  carSizeName.addEventListener("keypress", (e) =>
    Validations.textValidation(e)
  );

  // Lógica para agregar o actualizar tamaño de carros
  let isLoadingCar = false;
  carSizeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!carSizeName.value.trim()) {
      Alerts.showToastCloseError(
        "El nombre del tamaño de vehículo no puede ser nulo"
      );
      return;
    }

    if (isLoadingCar) return;
    isLoadingCar = true;
    let res;

    if (idCarSize.value) {
      res = await VehiclesController.updateCarSize(
        carSizeName,
        carSizeForm,
        idCarSize
      );
    } else {
      res = await VehiclesController.insertCarSize(carSizeName, carSizeForm);
    }

    bsCarModal.hide();
    isLoadingCar = false;
    idCarSize.value = "";
    if (res?.ok) {
      await VehiclesController.reloadCarSize(container);
    }
  });

  // Lógica FuelType Tab
  let units = await getMeasureUnits();

  const addFuelTypeBtn = container.querySelector("#addFuelType");
  const closeFuelbtn = container.querySelector("#btnClose");
  const fuelTypeName = container.querySelector("#nombretxtFuel");
  const idFuelType = container.querySelector("#idtxt");
  const unitSelect = container.querySelector("#unitSelect");
  const CarbonFoot = container.querySelector("#huellatxt");
  const fuelTypeModal = container.querySelector("#FuelModal");
  const bsFuelModal = bootstrap.Modal.getOrCreateInstance(fuelTypeModal);
  const fuelTypeForm = container.querySelector("#FuelForm");

  FuelTypeController.loadMeasureUnit(units, unitSelect);

  if (addFuelTypeBtn) {
    addFuelTypeBtn.addEventListener("click", () => {
      idFuelType.value = "";
      fuelTypeName.value = "";
      CarbonFoot.value = "";
      unitSelect.selectedIndex = 0;
    });
  }
  if (closeFuelbtn) {
    closeFuelbtn.addEventListener("click", () => {
      idCarSize.value = "";
      carSizeName.value = "";
    });
  }

  // Validaciones para texboxs
  fuelTypeName.addEventListener("keypress", (e) =>
    Validations.textValidation(e)
  );
  CarbonFoot.addEventListener("keypress", (e) =>
    Validations.numberValidation(e)
  );

  // Lógica para ingresar o actualizar tipos de combustible
  let isFuelLoading = false;
  fuelTypeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!fuelTypeName.value.trim()) {
      Alerts.showToastCloseError("El nombre del combustible no puede ser nulo");
      return;
    }

    if (CarbonFoot.value <= 0) {
      Alerts.showToastCloseError(
        "El valor de la huella de carbono no puede ser menor o igual a cero"
      );
      return;
    }

    if (isFuelLoading) return;
    isFuelLoading = true;
    let res;

    if (idFuelType.value) {
      res = await FuelTypeController.updateFuelType(
        fuelTypeName,
        CarbonFoot,
        unitSelect,
        fuelTypeForm,
        idFuelType
      );
    } else {
      res = await FuelTypeController.insertFuelType(
        fuelTypeName,
        CarbonFoot,
        unitSelect,
        fuelTypeForm
      );
    }

    bsFuelModal.hide();
    isFuelLoading = false;
    idFuelType.value = "";
    if (res?.ok) {
      await FuelTypeController.reloadFuelType(container);
    }
  });

  // ---- Search para tamaños de carro y tipos de conbustible ----

  search.addEventListener("keypress", (e) => Validations.textValidation(e));

  if (search) {
    search.addEventListener("keyup", async (e) => {
      if (e.key === "Enter" || search.value == "") {
        // Tamaños de carro
        if (document.querySelector("#carSizeTab").classList.contains("show")) {
          VehiclesController.setCurrentPage(0);
          await VehiclesController.reloadCarSize(container);
        }
        // Unidades
        if (document.querySelector("#FuelTypeTab").classList.contains("show")) {
          FuelTypeController.setCurrentPage(0);
          await FuelTypeController.reloadFuelType(container);
        }
      }
    });
  }

  // ---- Mostrar solo botón de la pestaña activa ----
  addCarSizeBtn.style.display = "block";
  addFuelTypeBtn.style.display = "none";
  document.querySelectorAll("#tabList .nav-link").forEach((tab) => {
    tab.addEventListener("shown.bs.tab", (event) => {
      const target = event.target.getAttribute("href");
      addCarSizeBtn.style.display = target === "#carSizeTab" ? "block" : "none";
      addFuelTypeBtn.style.display = target === "#FuelTypeTab" ? "block" : "none";
    });
  });
}