import * as FuelTypeController from '../../controllers/resources/ServicePageController/serviceController';
import * as ServiceController from '../../controllers/resources/serviceController.js';
import { getAllServicesList } from "../../services/resources/serviceService.js";
import { getAllMeasureUnitList } from "../../services/resources/serviceService.js";

export async function render() {
    return `
<div class="container py-4" id="service-root">
    <h2 class="general-title">Servicios</h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#ServiceModal" id="addService-kz">
                <i class="bi bi-plus-circle"></i> Añadir Servicio
            </button>
        </div>
    </div>
    <div class="modal fade" id="ServiceModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title">Añadir Servicio</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form id="ServiceForm">
                    <div class="modal-body mx-3">
                        <div class="col-sm-6 d-none">
                            <label for="idtxt" class="form-label">id</label>
                            <input id="idtxt" type="text" class="form-control" placeholder="id">
                        </div>
                        <div class="mb-3">
                            <label for="nombreServicio" class="form-label">Servicio</label>
                            <select id="servicetxt" class="form-select">
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="unidadServicio" class="form-label">Unidad de medida</label>
                            <select id="unidadServiciotxt" class="form-select">
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="huellaCarbono" class="form-label">Huella de carbono</label>
                            <input id="carbonFootprinttxt" type="number" class="form-control" placeholder="Huella de carbono">
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
    <div class="tab-content" id="tabContent"></div>
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
  `;
}
export async function afterRender() {
    ///Obtenemos los servicios
    let service = await getAllServicesList();
    ///Obtenemos las unidades de medida
    let idMeasureUnit = await getAllMeasureUnitList();
    ///Aca mandamos a llamar el init de userController que es el que llena la tabla, por eso le pasamos container
    const container = document.getElementById('service-root');
    ServiceController.init(container);

    ///Obtenemos nuestros elementos
    const addServiceBtn = document.querySelector('#addService-kz');
    const serviceSelect = document.querySelector('#servicetxt');
    const measureUnitSelect = document.querySelector('#unidadServiciotxt');
    const carbonFootprinttxt = document.querySelector('#carbonFootprinttxt');
    const serviceForm = document.querySelector('#ServiceForm');
    const modalEl = document.getElementById('ServiceModal')
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl)
    const idHideen = document.querySelector('#idtxt');

    ///Aca mandamos a llenar el loadServices y le pasamos los roles que hemos obtenido asi como el formselect
    ServiceController.loadService(service, serviceSelect);
   ///Aca mandamos a llenar el loadMeasureUnit y le pasamos los roles que hemos obtenido asi como el formselect
    ServiceController.loadMeasureUnit(idMeasureUnit, measureUnitSelect);
    
    ///Aca definimos que si el boton existe, al hacerle click vamos a limpiar los campos al cargar
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', () => {
            idHideen.value = '';
            serviceSelect.selectedIndex = 0;
            measureUnitSelect.selectedIndex = 0;
            carbonFootprinttxt.value = '';
        });
    }

    let isLoading = false;

    ///Aca ya vinculamos la parte del insert/update con el submit de nuestro formulario, pasamos datos segun sean solicitados
    serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isLoading) return;
    isLoading = true;   
    let res;
    if (idHideen.value) {
      res = await ServiceController.updateService(serviceSelect, measureUnitSelect, carbonFootprinttxt, serviceForm, idHideen);
    } else {
      res = await ServiceController.insertService(serviceSelect, measureUnitSelect, carbonFootprinttxt, serviceForm);
    }

    bsModal.hide();
    isLoading = false;
    idHideen.value = '';
    ///Si la respueta que nos retorna ya sea updateUser o insertUser es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
    if (res?.ok) {
      await ServiceController.reload(container);
    }
  });
}

export async function FuelTypeProcess(){
    const container = document.getElementById('fuelType-root')
    FuelTypeController.FuelTypeInit(container)

    const addFuelTypeBtn = container.querySelector('#addFuelType')
    const closebtn = container.querySelector('#btnClose')
    const FuelTypeName = container.querySelector('#nombretxt')
    const measureUnit = container.querySelector('#unidadServicio')
    const carbonFootPrint = container.querySelector('#huellacarbontxt')
    const idFuelType = container.querySelector('#idtxt')
    const fuelTypeModal = container.querySelector('#FuelTypeModal')
    const bsModal = bootstrap.Modal.getOrCreateInstance(fuelTypeModal)
    const fuelTypeForm = container.querySelector('#FuelTypeForm')

    if(addFuelTypeBtn){
        addFuelTypeBtn.addEventListener('click', ()=>{
            idFuelType.value = ''
            FuelTypeName.value = ''
            measureUnit.value = ''
            carbonFootPrint.value = "";
        });
    }
    if(closebtn){
        closebtn.addEventListener('click', ()=>{
            idFuelType.value = ''
            FuelTypeName.value = ''
            measureUnit.value = ''
            carbonFootPrint.value = "";
        });
    }

    document.getElementById("nombretxt").addEventListener("keypress", function (e) {
    let char = String.fromCharCode(e.which); // la tecla presionada
    let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/; // solo letras y espacios
    if (!regex.test(char)) {
        e.preventDefault(); // cancela la tecla
    }
});

 document.getElementById("huellacarbontxt").addEventListener("keypress", function (e) {
    let val = String.fromCharCode(e.which);
    let p = e.target.value;

    //Permitir numeros y punto
    if (!/[0-9.]/.test(val)) {
        e.preventDefault();
        return;
    }

    //Validacion para no permitir mas de un punto de decimal
    if (val === "." && p.includes(".")) {
        e.preventDefault();
        return;
    }

    //No mas de dos decimales despues del punto
    if (p.includes(".")) {
        let parte = p.split(".");
        if (parte[1].length >= 2 && e.target.selectionStart > p.indexOf(".")) {
            e.preventDefault();
            return;
        }
    }
});

let isLoading = false;

fuelTypeForm.addEventListener('submit', async e =>{
    e.preventDefault();
    if(isLoading) return;
    isLoading = true;
    let res;

    if(idFuelType.value){
        res = await FuelTypeController.updateFuelType(FuelTypeName, measureUnit, carbonFootPrint, fuelTypeForm, idFuelType)
    }
    else {
        res = await FuelTypeController.insertFuelType(FuelTypeName, measureUnit, carbonFootPrint, fuelTypeForm)
    }

    bsModal.hide();
    isLoading = false;
    idFuelType.value = ''
    if(res?.ok){
        await FuelTypeController.reloadFuelType(container)
    }
})
}