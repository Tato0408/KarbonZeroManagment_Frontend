import * as FuelTypeController from '../../controllers/resources/ServicePageController/serviceController';

export async function render() {
    return `
<div class="container py-4">
    <h2 class="general-title">Servicios</h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#ServiceModal">
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
                        <div class="mb-3">
                            <label for="nombreServicio" class="form-label">Servicio</label>
                            <input id="nombreServicio" type="text" class="form-control"
                                placeholder="Nombre del servicio" required>
                        </div>
                        <div class="mb-3">
                            <label for="unidadServicio" class="form-label">Unidad de medida</label>
                            <input id="unidadServicio" type="text" class="form-control" placeholder="Unidad de medida"
                                required>
                        </div>
                        <div class="mb-3">
                            <label for="huellaServicio" class="form-label">Huella de carbono</label>
                            <input id="huellaServicio" type="number" class="form-control" placeholder="Huella de carbono">
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
</div>
  `;
}
export function afterRender() {
    FuelTypeProcess()
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