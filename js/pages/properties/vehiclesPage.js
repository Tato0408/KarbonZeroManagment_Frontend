import * as VehiclesController from '../../controllers/properties/vehiclesController/vehiclesController';
import * as FuelTypeController from '../../controllers/properties/vehiclesController/fuelTypeController'
import { getMeasureUnits } from '../../services/properties/fuelTypeService';
import { initAllVehiclesTabs } from "../../controllers/properties/vehiclesController/vehicelsInitController";

export async function render() {
    return `
<div class="container py-4" id="vehicles-root">
        <h2 class="general-title">
            Vehiculo
        </h2>
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
                                    <input id="nombretxtFuel"required type="text" class="form-control" placeholder="Nombre">
                                </div>
                                <div class="col-sm-6">
                                    <label for="huellatxt" class="form-label">Huella de Carbono</label>
                                    <input id="huellatxt" required type="text" class="form-control"
                                        placeholder="Huella de carbono">
                                </div>
                                <div class="row g-2 mb-2">
                                    <label for="recursotxt" class="form-label">Unidad de medida</label>
                                    <select id="recursotxt" class="form-select">
                                        <option>...</option>
                                        <option>...</option>
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
                <!-- filtros tamano -->
                <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap"
                    style="background:#f5f5f5;">
                    <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
                        <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control border-0 bg-transparent" id="searchCarSize"
                            placeholder="Buscar">
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
                        <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#CarModal"
                            id="addCarSize">
                            <i class="bi bi-plus-circle"></i> Añadir Tamano
                        </button>
                    </div>
                </div>
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
                <!-- filtros tipo de combustible -->
                <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap"
                    style="background:#f5f5f5;">
                    <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
                        <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control border-0 bg-transparent" id="searchFuelType"
                            placeholder="Buscar">
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
                        <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#FuelModal"
                            id="addFuelType">
                            <i class="bi bi-plus-circle"></i> Añadir Tipo de Combustible
                        </button>
                    </div>
                </div>
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
    const container = document.getElementById('vehicles-root')
    await initAllVehiclesTabs(container);
    carSizeProcess()
    fuelTypeProcess()
}

export async function carSizeProcess() {
    const container = document.getElementById('vehicles-root')

    const addCarSizeBtn = container.querySelector('#addCarSize')
    const closebtn = container.querySelector('#btnClose')
    const carSizeName = container.querySelector('#nombretxt')
    const idCarSize = container.querySelector('#idtxt')
    const carSizeModal = container.querySelector('#CarModal')
    const bsModal = bootstrap.Modal.getOrCreateInstance(carSizeModal)
    const carSizeForm = container.querySelector('#CarForm')
    const search = document.querySelector('#searchCarSize')
        search.addEventListener("keyup", (e) => {
            if (e.key == "Enter") {
                VehiclesController.setCurrentPage(0);
                VehiclesController.reloadCarSize(container);
            }
            if(search.value == ""){
                VehiclesController.reloadCarSize(container)
            }
        })
        
    if (addCarSizeBtn) {
        addCarSizeBtn.addEventListener('click', () => {
            idCarSize.value = ''
            carSizeName.value = '';
        });
    }
    if (closebtn) {
        closebtn.addEventListener('click', () => {
            idCarSize.value = ''
            carSizeName.value = '';
        });
    }
    
    document.getElementById("nombretxt").addEventListener("keypress", function (e) {
        let char = String.fromCharCode(e.which); // la tecla presionada
        let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/; // solo letras y espacios
        if (!regex.test(char)) {
            e.preventDefault(); // cancela la tecla
        }
    });

    let isLoading = false;
    carSizeForm.addEventListener('submit', async e => {
        e.preventDefault();
        if (isLoading) return;
        isLoading = true;
        let res;

        if (idCarSize.value) {
            res = await VehiclesController.updateCarSize(carSizeName, carSizeForm, idCarSize)
        }
        else {
            res = await VehiclesController.insertCarSize(carSizeName, carSizeForm)
        }

        bsModal.hide();
        isLoading = false;
        idC.value = ''
        if (res?.ok) {
            await VehiclesController.reloadCarSize(container)
        }
    })
}



export async function fuelTypeProcess() {
    let data = await getMeasureUnits();
    const container = document.getElementById('vehicles-root')

    const addFuelTypeBtn = container.querySelector('#addFuelType')
    const closebtn = container.querySelector('#btnClose')
    const fuelTypeName = container.querySelector('#nombretxtFuel')
    const idFuelType = container.querySelector('#idtxt')
    const Resource = container.querySelector('#recursotxt')
    const CarbonFoot = container.querySelector('#huellatxt')
    const fuelTypeModal = container.querySelector('#FuelModal')
    const bsModal = bootstrap.Modal.getOrCreateInstance(fuelTypeModal)
    const fuelTypeForm = container.querySelector('#FuelForm')
    const search = document.querySelector('#searchFuelType')
        search.addEventListener("keyup", (e) => {
            if (e.key == "Enter") {
                FuelTypeController.setCurrentPage(0);
                FuelTypeController.reloadFuelType(container);
            }
            if(search.value == ""){
                FuelTypeController.reloadFuelType(container)
            }
        })
        FuelTypeController.loadMeasureUnit(data, Resource);
    if (addFuelTypeBtn) {
        addFuelTypeBtn.addEventListener('click', () => {
            idFuelType.value = ''
            fuelTypeName.value = ''
            Resource.value = ''
            CarbonFoot.value = '';
        });
    }
    if (closebtn) {
        closebtn.addEventListener('click', () => {
            idCarSize.value = ''
            carSizeName.value = '';
        });
    }

    document.getElementById("nombretxt").addEventListener("keypress", function (e) {
        let char = String.fromCharCode(e.which); // la tecla presionada
        let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/; // solo letras y espacios
        if (!regex.test(char)) {
            e.preventDefault(); // cancela la tecla
        }
    });

    let isLoading = false;
    fuelTypeForm.addEventListener('submit', async e => {
        e.preventDefault();
        if (isLoading) return;
        isLoading = true;
        let res;

        if (idFuelType.value) {
            res = await FuelTypeController.updateFuelType(fuelTypeName, CarbonFoot,Resource,  fuelTypeForm, idFuelType)
        }
        else {
            res = await FuelTypeController.insertFuelType(fuelTypeName, CarbonFoot, Resource, fuelTypeForm)
        }

        bsModal.hide();
        isLoading = false;
        idFuelType.value = ''
        if (res?.ok) {
            await FuelTypeController.reloadFuelType(container)
        }
    })
}