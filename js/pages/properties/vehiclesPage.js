import * as VehiclesController from '../../controllers/properties/vehiclesController';

export async function render() {
    return `
<div class="container py-4">
    <h2 class="general-title">
        Vehiculo
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" id="button-kz">

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
                <form id="CartForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <div class="col-sm-12">
                                <label for="medidatxt" class="form-label">Medida</label>
                                <input id="medidatxt" type="text" class="form-control" placeholder="Medida">
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
                                <label for="nombretxt" class="form-label">Nombre</label>
                                <input id="nombretxt" type="text" class="form-control" placeholder="Nombre">
                            </div>
                            <div class="col-sm-6">
                                <label for="nombretxt" class="form-label">Huella de Carbono</label>
                                <input id="nombretxt" type="number" class="form-control" placeholder="Huella de carbono">
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
    <div class="tab-content" id="tabContent"></div>
</div>
  `;
}
export function afterRender() {
    carSizeProcess()
}

export async function carSizeProcess(){
    const container = document.getElementById('carSize-root')
    VehiclesController.CarSizeInit(container)

    const addCarSizeBtn = container.querySelector('#addCarSize')
    const closebtn = container.querySelector('#btnClose')
    const carSizeName = container.querySelector('#nombretxt')
    const idCarSize = container.querySelector('#idtxt')
    const carSizeModal = container.querySelector('#CarSizeModal')
    const bsModal = bootstrap.Modal.getOrCreateInstance(carSizeModal)
    const carSizeForm = container.querySelector('#CarSizeForm')

    if(addCarSizeBtn){
        addCountryBtn.addEventListener('click', ()=>{
            idCarSize.value = ''
            carSizeName.value = '';
        });
    }
    if(closebtn){
        closebtn.addEventListener('click', ()=>{
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

carSizeForm.addEventListener('submit', async e =>{
    e.preventDefault();
    if(isLoading) return;
    isLoading = true;
    let res;

    if(idCarSize.value){
        res = await VehiclesController.updateCarSize(carSizeName, carSizeForm, idCarSize)
    }
    else {
        res = await VehiclesController.insertCarSize(carSizeName, carSizeForm)
    }

    bsModal.hide();
    isLoading = false;
    idCountry.value = ''
    if(res?.ok){
        await VehiclesController.reloadCarSize(container)
    }
})
}