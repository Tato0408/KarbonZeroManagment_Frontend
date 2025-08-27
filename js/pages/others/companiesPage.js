import * as CompanyController from '../../controllers/others/companiesController';
export async function render() {
    return `
<div class="container py-4">
    <h2 class="general-title">
        Compañia
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#CompaniModal">
                <i class="bi bi-plus-circle"></i> Añadir Compañia
            </button>
        </div>
    </div>
    <div class="modal fade" id="CompaniModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
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
    companiesProcess()
}

export async function companiesProcess(){
    const container = document.getElementById('companie-root')
    CompanyController.CompanieInit(container)

    const addCompanyBtn = container.querySelector('#addCompany')
    const closebtn = container.querySelector('#btnClose')
    const companyName = container.querySelector('#nombretxt')
    const companyDomain = container.querySelector('#dominiotxt')
    const idCompany = container.querySelector('#idtxt')
    const companyModal = container.querySelector('#CompanyModal')
    const bsModal = bootstrap.Modal.getOrCreateInstance(companyModal)
    const companyForm = container.querySelector('#CompaniForm')

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

   if (!regex.test(val)) {
        errorMessage.textContent = "Por favor, ingrese un dominio válido (ejemplo: www.abc.com)";
    }
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
        await CompanyController.reloadComapny(container)
    }
})
}