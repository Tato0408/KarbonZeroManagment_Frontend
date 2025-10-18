import * as PetController from "../../controllers/properties/petsController";
import * as Alerts from "../../../utils/alerts.js";
import * as Validations from "../../../utils/validations.js";

export async function render() {
  return `
<div class="container py-4" id="pet-root">
    <h2 class="general-title">Mascota</h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" id="PetSearch" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" id="addPet" data-bs-toggle="modal" data-bs-target="#PetModal">
                <i class="bi bi-plus-circle"></i> Añadir Tipo de Mascota
            </button>
        </div>
    </div>

    <div class="modal fade" id="PetModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title">Mascota</h4>
                    <button type="button" class="btn-close" id="btnClose" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="PetForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6">
                                <label for="nombretxt" class="form-label">Tipo de mascota</label>
                                <input id="nombretxt" required type="text" class="form-control" placeholder="Tipo de mascota" pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" title="Solo se permiten letras y espacios" maxlength="200">
                            </div>
                            <div class="col-sm-6">
                                <label for="huellacarbontxt" class="form-label">Huella de carbono</label>
                                <input id="huellacarbontxt" required type="number" class="form-control" placeholder="Huella de carbono" step="0.01" min=0>
                            </div>
                            <input id="idtxt" type="text" class="form-control d-none hidden" placeholder="id">
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
            <nav aria-label="Page navigation" class="d-flex justify-content-center">
                <ul class="pagination mb-0" id="petPagination"></ul>
            </nav>
        </div>
    </div>
</div>
  `;
}

export function afterRender() {
  petsProcess();
}

export async function petsProcess() {
  const container = document.getElementById("pet-root");
  PetController.PetsInit(container);

  const addPetBtn = container.querySelector("#addPet");
  const closebtn = container.querySelector("#btnClose");
  const petName = container.querySelector("#nombretxt");
  const carbonFootPrint = container.querySelector("#huellacarbontxt");
  const idPet = container.querySelector("#idtxt");
  const PetModal = container.querySelector("#PetModal");
  const bsModal = bootstrap.Modal.getOrCreateInstance(PetModal);
  const petForm = container.querySelector("#PetForm");
  const PetSearch = container.querySelector("#PetSearch"); // ✅ el search input

  if (addPetBtn) {
    addPetBtn.addEventListener("click", () => {
      idPet.value = "";
      petName.value = "";
      carbonFootPrint.value = "";
    });
  }
  if (closebtn) {
    closebtn.addEventListener("click", () => {
      idPet.value = "";
      petName.value = "";
      carbonFootPrint.value = "";
    });
  }

  petName.addEventListener("keypress", (e) => Validations.textValidation(e));
  carbonFootPrint.addEventListener("keypress", (e) => Validations.numberValidation(e));

  PetSearch.addEventListener("keypress", (e) => Validations.textValidation(e));

  if (PetSearch) {
    PetSearch.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || PetSearch.value == "") {
        PetController.setCurrentPage(0);
        PetController.reloadPet(container);
      } 
    });
  }

  let isLoading = false;
  petForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!petName.value.trim()) {
      Alerts.showToastCloseError(
        "El nombre del tipo de mascota no puede ser nulo"
      );
      return;
    }
    if (carbonFootPrint.value <= 0) {
      Alerts.showToastCloseError(
        "El valor de la huella de carbono no puede ser menor o igual a cero"
      );
      return;
    }

    if (isLoading) return;
    isLoading = true;

    let res;
    if (idPet.value) {
      res = await PetController.updatePetType(
        petName,
        carbonFootPrint,
        petForm,
        idPet
      );
    } else {
      res = await PetController.insertPet(petName, carbonFootPrint, petForm);
    }

    bsModal.hide();
    isLoading = false;
    idPet.value = "";
    if (res?.ok) await PetController.reloadPet(container);
  });
}
