import * as LivingSpaceController from '../../controllers/properties/housesController';
export async function render() {
    return `
<div class="container py-4" id="house-root">
    <h2 class="general-title">
        Viviendas
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" id="searchHouse"placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#viviendaModal" id="addHouse-kz">
                <i class="bi bi-plus-circle"></i> Añadir Tipo de vivienda
            </button>
        </div>
    </div>
    <div class="modal fade" id="viviendaModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Viviendas</h4>
                    <button type="button" class="btn-close" id="btnClose" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="houseForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6">
                                <label for="nombretxt"  class="form-label">Tipo de Vivienda</label>
                                <input id="nombretxt" required type="text" class="form-control" placeholder="Tipo de Vivienda">
                            </div>
                            <div class="col-sm-6">
                                <label for="huellacarbontxt" class="form-label">Huella de carbono</label>
                                <input id="huellacarbontxt" required type="text" step="any"class="form-control" placeholder="Huella de carbono">
                            </div>
                             <label for="idtxt"class="form-label d-none">id</label>
                        <input id="idtxt"type="text"class="form-control d-none hidden"placeholder="id">
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
            <ul class="pagination mb-0" id="housePagination">
              
            </ul>
          </nav>
        </div>
      </div>
    </div>

</div>
  `;
}
export function afterRender() {
    houseProcess();
}

export async function houseProcess(){
    const container = document.getElementById('house-root')
    LivingSpaceController.LivingInit(container)

    
    const adsHouseBtn = document.querySelector('#addHouse-kz')
    const houseName = document.querySelector('#nombretxt')
    const carbonFootPrint = document.querySelector('#huellacarbontxt') 
    const idHidden = document.querySelector('#idtxt')
    const houseModal = document.querySelector('#viviendaModal') 
    const bsModal = bootstrap.Modal.getOrCreateInstance(houseModal)
    const btnClose = document.getElementById('btnClose') 
    const houseForm = document.querySelector('#houseForm')
    const search = document.querySelector('#searchHouse')

    search.addEventListener("keyup", (e) => {
     if (e.key == "Enter") {
        LivingSpaceController.setCurrentPage(0);
        LivingSpaceController.reloadHouse(container);
     }
     if(search.value == ""){
        LivingSpaceController.reloadHouse(container)
     }
  })

    if(adsHouseBtn){
        adsHouseBtn.addEventListener('click', ()=>{
            idHidden.value = ''
            houseName.value = ''
            carbonFootPrint.value = "";
        });
    }
    if(btnClose){
        btnClose.addEventListener('click', ()=>{
            idHidden.value = ''
            houseName.value = ''
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

    houseForm.addEventListener('submit', async e =>{
        e.preventDefault();
        if(isLoading) return;
        isLoading = true;
        let res;
        if(idHidden.value){
            res = await LivingSpaceController.updateLivingSpaceType(
                houseName, carbonFootPrint, houseForm, idHidden
            )
        } else {
            res = await LivingSpaceController.insertLivingSpaceType(
                houseName, carbonFootPrint, houseForm
            )
        }
        bsModal.hide();
        isLoading = false;
        idHidden.value = ''
        if(res?.ok){
            await LivingSpaceController.reloadHouse(container); 
        }
    })    
}