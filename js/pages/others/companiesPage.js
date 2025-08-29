import * as CompanyController from '../../controllers/others/companiesController';

export async function render() {
    return `
<div class="container py-4" id="company-root">
    <h2 class="general-title">
        Compañias
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" id="CompanySearch" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#CompanyModal" id="addCompany-kz">
                <i class="bi bi-plus-circle"></i> Añadir Compañia
            </button>
        </div>
    </div>
    <div class="modal fade" id="CompanyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Compañia</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="CompanyForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6 d-none">
                                <label for="idtxt" class="form-label">id</label>
                                <input id="idtxt" type="text" class="form-control" placeholder="id">
                            </div>
                            <div class="col-sm-6">
                                <label for="nombretxt" class="form-label">Nombre</label>
                                <input id="nombretxt" type="text" class="form-control" required placeholder="Nombre">
                            </div>
                            <div class="col-sm-6">
                                <label for="dominiotxt" class="form-label">Dominio</label>
                                <input id="dominiotxt" type="text" class="form-control" required placeholder="Dominio">
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
    <!-- Paginación -->
      <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
        <div class="col-auto d-flex justify-content-start">
          <select class="form-select" aria-label="Items por pagina" id="itemsSelectCompany">
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10" selected>10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div class="col d-flex justify-content-end">
          <nav aria-label="Page navigation example" class="d-flex justify-content-center">
            <ul class="pagination mb-0" id="companyPagination">
              
            </ul>
          </nav>
        </div>
      </div>
</div>
  `;
}
export function afterRender() {
  const container = document.getElementById('company-root');
  CompanyController.init(container);

  const addCompanyBtn = document.querySelector('#addCompany-kz');
  const nametxt = document.querySelector('#nombretxt');
  const domaintxt = document.querySelector('#dominiotxt');
  const CompanyForm = document.querySelector('#CompanyForm');
  const modalEl = document.getElementById('CompanyModal')
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl)
  const idHideen = document.querySelector('#idtxt');

  if (addCompanyBtn) {
    addCompanyBtn.addEventListener('click', () => {
      idHideen.value = '';
      nametxt.value = '';
      domaintxt.value = '';
      });
  }

  let isLoading = false;

  CompanyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isLoading) return;
  isLoading = true;
  let res;
  if (idHideen.value) {
    res = await CompanyController.updateCompany(nametxt, domaintxt, CompanyForm, idHideen);
  } else {
    res = await CompanyController.insertCompany(nametxt, domaintxt, CompanyForm);
  }

  bsModal.hide();
  isLoading = false;
  idHideen.value = '';
  ///Si la respueta que nos retorna ya sea updateUser o insertUser es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
  if (res?.ok) {
    await CompanyController.reload(container);
  }
  });

  const companySearch = document.querySelector("#CompanySearch");
  companySearch.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    CompanyController.setCurrentPage(0);
    CompanyController.reload(container);
  }
  });
}
