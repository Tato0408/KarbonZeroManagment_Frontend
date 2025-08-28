import * as CompanyService from "../../services/others/companiesService"
import * as Alerts from '../../../utils/alerts'

export async function CompanyInit(container) {
    try {
        renderData(container)
    }
    catch (err) {
        console.log(`Error : ${err}`)
    }
}

let currentPage = 0;
let currentSize = 10;
export async function setCurrentPage(page) {
  currentPage = page;
}
export async function reloadCompany(container) {
    if (!container) return

     try {
            const search = document.querySelector('#searchCompany')
             const searchCompany = search.value
             let data
             if(!searchCompany){
                data =  await CompanyService.getCompanies(currentPage, currentSize)
             }
             else{
                data = await CompanyService.getCompanyByName(searchCompany, currentPage, currentSize)
             }
             
            const company = data.content
            const $tabContent = container.querySelector('#tabContent')
            LoadTable(company, $tabContent)
    
            renderPagination(data.number, data.totalPages, container)
        }
        catch (err) {
            console.error(e)
        }
}

async function renderData(container) {
    let companie = []

    try {
        const data = await CompanyService.getCompanies(currentPage, currentSize)

        companie = data.content
    }
    catch {
        console.log("ERROR: ", err)
        return container.innerHTML = `<p class="text-danger">No se pudieron cargar los recursos.</p>`;
    }

    const tab = container.querySelector('#tabContent')
    const $tabList = container.querySelector("#tabList");
    $tabList.innerHTML = `
                <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="empresas">Compañias</a>
        </li>
        `
    LoadTable(companie, tab)
    const sizeSelector = document.getElementById('itemsSelect')
    sizeSelector.addEventListener("change", () => {
        currentSize = parseInt(sizeSelector.value);
        currentPage = 0;
        reloadCountry(container)
    })
    container.addEventListener('click', async e => {
        const btn = e.target.closest('.btn-delete-company');
        if (!btn) return;
        const id = btn.dataset.id;
        const ok = await CompanyService.deleteCompany(id);
        console.log(ok)
        //En caso de que duvuelva true retornamos
        if (ok) await reloadCompany(container);
    });

    ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
    container.addEventListener('click', async e => {
        const editBtn = e.target.closest('.btn-edit-company');
        if (!editBtn) return;
        const id = editBtn.dataset.id;
        try {
            const companie = await CompanyService.getCompanyById(id);
            document.getElementById('idtxt').value = companie.idCompany ?? '';
            document.getElementById('nombretxt').value = companie.name ?? '';
            document.getElementById('dominiotxt').value = companie.domain ?? '';
        }

        catch (err) {
            Alerts.showToastCloseError('No ha sido posible cargar las compañias');
            console.error(err);
        }
    })
}

export function LoadTable(companie, tab){
    const baseIndex  = currentPage * currentSize;
     tab.innerHTML = "";
     tab.innerHTML = `
        <div id="compañias" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Compañias</th>
                <th>Dominio</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerHouse">
            ${companie.map((u, i) => `
              <tr>
                <td>${baseIndex+ i + 1}</td>
                <td>${u.name}</td>
                <td>${u.domain}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-company" data-id="${u.idCompany}" data-bs-toggle="modal" data-bs-target="#CompanyModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-company" data-id="${u.idCompany}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
     `
}

export async function insertCompany(nombreCompañia, Dominio, form){
    const playload = {
        name: nombreCompañia.value.trim(),
        domain:Dominio.value.trim()
    }
    try{
        console.log(playload)
        const res = await CompanyService.insertCompany(playload)
        form.reset()
        return res
    }
    catch(err){
        Alerts.showToastCloseError(`No se pudo agregar la compañia ${err}`);
        return { ok: false };
    }
}

export async function updateCompany( nombreCompañia, Dominio, form, idtxt){
     const playload= {
         idCompany:idtxt.value,
         name: nombreCompañia.value.trim(),
         domain: Dominio.value.trim()
     }
     console.log(playload)
     try{
         const res = await CompanyService.updateCompany(playload, idtxt);
         console.log(res)
         form.reset();
         return res;
     }
     catch(err){
         Alerts.showToastCloseError(`No se pueden actualizar los datos ${err}`);
         console.log(err);
     ///Retornamos un false
     return { ok: false };
     }
  }
  
  export function renderPagination(current, totalPages, container){
     //Acá accedemos al ul de paginación
     const pagination = document.getElementById('companyPagination')
     if(!pagination) return;
     pagination.innerHTML = "";
 
     const prev = document.createElement("li");
     prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
     prev.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`
     
     prev.addEventListener("click", (e)=>{
          e.preventDefault();
          if(current > 0){
          currentPage = current -1; //Retrocede una página
 
         reloadCompany(container);
       }
     });
 
     pagination.appendChild(prev);
 
     //Control de número de páginas
 
     for(let i = 0; i < totalPages; i++){
         const li = document.createElement("li");
         li.className =` page-item ${i === current ? "active" : ""}`;
         li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`
         li.addEventListener("click", (e) => {
             e.preventDefault();
             if(currentPage !== i){
                 currentPage = i;
                 reloadCompany(container);
             }
         })
         pagination.appendChild(li);
     }
 
      const next = document.createElement("li");
     next.className = `page-item ${current >= totalPages - 1 ? "disabled" : ""}`;
      next.innerHTML = `<a class="page-link" href="#" aria-label="Next">
                       <span aria-hidden="true">&raquo;</span>
                     </a>`;
      next.addEventListener("click", (e) => {
     e.preventDefault();
     if (current < totalPages - 1) {
       currentPage = current + 1;///Avanza una pagina
       reloadCompany(container);
     }
   });
   pagination.appendChild(next);
 }