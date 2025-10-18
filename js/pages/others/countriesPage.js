import * as CountryController from "../../controllers/others/countriesController";
import * as Alerts from "../../../utils/alerts.js";
import * as Validations from "../../../utils/validations.js";

export async function render() {
  return `
<div class="container py-4" id="country-root">
    <h2 class="general-title">
        País
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" id="searchCountry" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" id="addCountry"data-bs-toggle="modal" data-bs-target="#CountryModal">
                <i class="bi bi-plus-circle"></i> Añadir País
            </button>
        </div>
    </div>
    <div class="modal fade" id="CountryModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">País</h4>
                    <button type="button" class="btn-close" 
                    id="btnClose"
                    style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="CountryForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6">
                                <label for="nombretxt" class="form-label">Nombre</label>
                                <input id="nombretxt" required type="text" class="form-control" placeholder="Nombre" pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" title="Solo se permiten letras y espacios" maxlength="200">
                            </div>
                            <div class="col-sm-6">
                                <label for="huellacarbontxt" class="form-label">Huella de carbono</label>
                                <input id="huellacarbontxt" required type="number" class="form-control" step="0.01" min=0 placeholder="Huella de carbono">
                            </div>
                             <label for="idtxt"class="form-label d-none">id</label>
                        <input id="idtxt"type="text"class="form-control d-none hidden"placeholder="id">
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create"
                        id="btnAddCountry">Guardar</button>
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
            <ul class="pagination mb-0" id="countryPagination">
              
            </ul>
          </nav>
        </div>
      </div>
    </div>

</div>

  `;
}
export function afterRender() {
  countryProcess();
}

export async function countryProcess() {
  const container = document.getElementById("country-root");
  CountryController.CountryInit(container);

  const addCountryBtn = container.querySelector("#addCountry");
  const closebtn = container.querySelector("#btnClose");
  const countryName = container.querySelector("#nombretxt");
  const carbonFootPrint = container.querySelector("#huellacarbontxt");
  const idCountry = container.querySelector("#idtxt");
  const countryModal = container.querySelector("#CountryModal");
  const bsModal = bootstrap.Modal.getOrCreateInstance(countryModal);
  const countryForm = container.querySelector("#CountryForm");
  const search = document.querySelector("#searchCountry");

  search.addEventListener("keypress", (e) => Validations.textValidation(e));

  search.addEventListener("keyup", (e) => {
    if (e.key == "Enter" || search.value == "") {
      CountryController.setCurrentPage(0);
      CountryController.reloadCountry(container);
    }
  });

  if (addCountryBtn) {
    addCountryBtn.addEventListener("click", () => {
      idCountry.value = "";
      countryName.value = "";
      carbonFootPrint.value = "";
    });
  }
  if (closebtn) {
    closebtn.addEventListener("click", () => {
      idCountry.value = "";
      countryName.value = "";
      carbonFootPrint.value = "";
    });
  }

  countryName.addEventListener("keypress", (e) => Validations.textValidation(e));
  carbonFootPrint.addEventListener("keypress", (e) => Validations.numberValidation(e));

  let isLoading = false;
  countryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!countryName.value.trim()) {
        Alerts.showToastCloseError("El nombre del país no puede ser nulo");
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

    if (idCountry.value) {
      res = await CountryController.updateCountry(
        countryName,
        carbonFootPrint,
        countryForm,
        idCountry
      );
    } else {
      res = await CountryController.insertCountry(
        countryName,
        carbonFootPrint,
        countryForm
      );
    }

    bsModal.hide();
    isLoading = false;
    idCountry.value = "";
    if (res?.ok) {
      await CountryController.reloadCountry(container);
    }
  });
}
