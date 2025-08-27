import * as PetController from '../../controllers/properties/petsController';
export async function render() {
    return `
<div class="container py-4">
    <h2 class="general-title"> 
        Mascota
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" id="addPet" data-bs-toggle="modal" data-bs-target="#PetModal">
                <i class="bi bi-plus-circle"></i> Añadir Tipo de Mascota
            </button>
        </div>
    </div>
    <div class="modal fade" id="PetModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Mascota</h4>
                    <button type="button" class="btn-close" id="btnClose" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="PetForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6">
                                <label for="nombretxt" class="form-label">Tipo de mascota</label>
                                <input id="nombretxt" type="text" class="form-control" placeholder="Tipo de mascota">
                            </div>
                            <div class="col-sm-6">
                                <label for="huellacarbontxt" class="form-label">Huella de carbono</label>
                                <input id="huellacarbontxt" type="number" class="form-control" placeholder="Huella de carbono">
                                 </div>
                             <label for="idtxt"class="form-label d-none">id</label>
                        <input id="idtxt"type="text"class="form-control d-none hidden"placeholder="id">
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create" id="btnAddPet">Guardar</button>
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
            <ul class="pagination mb-0" id="petPagination">
              
            </ul>
          </nav>
        </div>
      </div>
    </div>

</div>
  `;
}
export function afterRender() {
    petsProcess()
}

export async function petsProcess() {
    const container = document.getElementById('pet-root')
    PetController.PetsInit(container)

    const addPetBtn = container.querySelector('#AddPet')
    const closebtn = container.querySelector('#btnClose')
    const petName = container.querySelector('#nombretxt')
    const carbonFootPrint = container.querySelector('#huellacarbontxt')
    const idPet = container.querySelector('#idtxt')
    const PetModal = container.querySelector('#PetModal')
    const bsModal = bootstrap.Modal.getOrCreateInstance(PetModal)
    const petForm = container.querySelector('#PetForm')

    if (addPetBtn) {
        addPetBtn.addEventListener('click', () => {
            idPet.value = ''
            petName.value = ''
            carbonFootPrint.value = "";
        });
    }
    if (closebtn) {
        closebtn.addEventListener('click', () => {
            idPet.value = ''
            petName.value = ''
            carbonFootPrint.value = "";
        });
    }

    document.getElementById("nombretxt").addEventListener("keypress", function (e) {
        let char = String.fromCharCode(e.which);
        let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/;
        if (!regex.test(char)) {
            e.preventDefault();
        }
    });

    document.getElementById("huellacarbontxt").addEventListener("keypress", function (e) {
        let val = String.fromCharCode(e.which);
        let p = e.target.value;

        if (!/[0-9.]/.test(val)) {
            e.preventDefault();
            return;
        }

        if (val === "." && p.includes(".")) {
            e.preventDefault();
            return;
        }

        if (p.includes(".")) {
            let parte = p.split(".");
            if (parte[1].length >= 2 && e.target.selectionStart > p.indexOf(".")) {
                e.preventDefault();
                return;
            }
        }
    });

    let isLoading = false;

    petForm.addEventListener('submit', async e => {
        e.preventDefault();
        if (isLoading) return;
        isLoading = true;
        let res;

        if (idPet.value) {
            res = await PetController.updatePet(petName, carbonFootPrint, petForm, idPet)
        }
        else {
            res = await PetController.insertPet(petName, carbonFootPrint, petForm)
        }

        bsModal.hide();
        isLoading = false;
        idPet.value = ''
        if (res?.ok) {
            await PetController.reloadPet(container)
        }
    })
}