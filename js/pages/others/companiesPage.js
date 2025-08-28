import * as CompanyController from '../../controllers/others/companiesController';
export async function render() {
    return `
<div class="container py-4" id="company-root">
    <h2 class="general-title">
        Compañia
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" id="searchCompany" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#CompanyModal">
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
                <form id="CompaniForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6">
                                <label for="nombretxt" class="form-label">Nombre</label>
                                <input id="nombretxt" type="text" class="form-control" placeholder="Nombre">
                            </div>
                            <div class="col-sm-6">
                                <label for="dominiotxt" class="form-label">Dominio</label>
                                <input id="dominiotxt" type="text" class="form-control" placeholder="Dominio">
                            </div>
                             <div class="col-sm-6">
                                <label for="idtxt"class="form-label d-none">id</label>
                        <input id="idtxt"type="text"class="form-control d-none hidden"placeholder="id">
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
    companiesProcess()
}

export async function companiesProcess(){
    const container = document.getElementById('company-root')
    CompanyController.CompanyInit(container)

    const addCompanyBtn = container.querySelector('#addCompany')
    const closebtn = container.querySelector('#btnClose')
    const companyName = container.querySelector('#nombretxt')
    const companyDomain = container.querySelector('#dominiotxt')
    const idCompany = container.querySelector('#idtxt')
    const companyModal = container.querySelector('#CompanyModal')
    const bsModal = bootstrap.Modal.getOrCreateInstance(companyModal)
    const companyForm = container.querySelector('#CompaniForm')
    const search = document.querySelector('#searchCompany')
    
        search.addEventListener("keyup", (e) => {
         if (e.key == "Enter") {
            CompanyController.setCurrentPage(0);
            CompanyController.reloadCompany(container);
         }
         if(search.value == ""){
            CompanyController.reloadCompany(container)
         }
      })
    if(addCompanyBtn){
        addCompanyBtn.addEventListener('click', ()=>{
            idCompany.value = ''
            companyName.value = ''
            companyDomain.value = "";
        });
    }
    if(closebtn){
        closebtn.addEventListener('click', ()=>{
            idCompany.value = ''
            companyName.value = ''
            companyDomain.value = "";
        });
    }

    document.getElementById("nombretxt").addEventListener("keypress", function (e) {
    let char = String.fromCharCode(e.which); // la tecla presionada
    let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/; // solo letras y espacios
    if (!regex.test(char)) {
        e.preventDefault(); // cancela la tecla
    }
});

 document.getElementById("dominiotxt").addEventListener("keypress", function (e) {
    let val = String.fromCharCode(e.which);
    
    const regex = /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/; // Expresión regular para validar el dominio

   
});

let isLoading = false;

companyForm.addEventListener('submit', async e =>{
    e.preventDefault();
    if(isLoading) return;
    isLoading = true;
    let res;

    if(idCompany.value){
        res = await CompanyController.updateCompany(companyName, companyDomain, companyForm, idCompany)
    }
    else {
        res = await CompanyController.insertCompany(companyName, companyDomain, companyForm)
    }

    bsModal.hide();
    isLoading = false;
    idCompany.value = ''
    if(res?.ok){
        await CompanyController.reloadCompany(container)
    }
})
}