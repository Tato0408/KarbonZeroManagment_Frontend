import * as CountryService from "../../services/others/countriesService"
import * as Alerts from '../../../utils/alerts'

export async function CountryInit(container) {
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

export async function reloadCountry(container) {
    if (!container) return
    
    try {
        const search = document.querySelector('#searchCountry')
         const searchCountry = search.value
         let data
         if(!searchCountry){
            data =  await CountryService.getCountries(currentPage, currentSize)
         }
         else{
            data = await CountryService.getCountryByName(searchCountry, currentPage, currentSize)
         }
         
        const country = data.content
        const $tabContent = container.querySelector('#tabContent')
        LoadTable(country, $tabContent)

        renderPagination(data.number, data.totalPages, container)
    }
    catch (err) {
        console.error(e)
    }
}

async function renderData(container) {
    let country = []

    try {
        const data = await CountryService.getCountries(currentPage, currentSize)

        country = data.content
    }
    catch {
        console.log("ERROR: ", err)
        return container.innerHTML = `<p class="text-danger">No se pudieron cargar los recursos.</p>`;
    }

    const tab = container.querySelector('#tabContent')
    const $tabList = container.querySelector("#tabList");
    $tabList.innerHTML = `
                <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="viviendas">Paises</a>
        </li>
        `
    LoadTable(country, tab)
    const sizeSelector = document.getElementById('itemsSelect')
    sizeSelector.addEventListener("change", () => {
        currentSize = parseInt(sizeSelector.value);
        currentPage = 0;
        reloadCountry(container)
    })
    container.addEventListener('click', async e => {
        const btn = e.target.closest('.btn-delete-country');
        if (!btn) return;
        const id = btn.dataset.id;
        const ok = await CountryService.deleteCountry(id);
        console.log(ok)
        //En caso de que duvuelva true retornamos
        if (ok) await reloadCountry(container);
    });

    ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
    container.addEventListener('click', async e => {
        const editBtn = e.target.closest('.btn-edit-country');
        if (!editBtn) return;
        const id = editBtn.dataset.id;
        try {
            const country = await CountryService.getCountriesById(id);
            document.getElementById('idtxt').value = country.idCountry ?? '';
            document.getElementById('nombretxt').value = country.name ?? '';
            document.getElementById('huellacarbontxt').value = country.carbonFootprint ?? '';
        }

        catch (err) {
            Alerts.showToastCloseError('No ha sido posible cargar los paises');
            console.error(err);
        }
    })
}

export function LoadTable(country, tab){
    const baseIndex  = currentPage * currentSize;
     tab.innerHTML = "";
     tab.innerHTML = `
        <div id="paises" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Paises</th>
                <th>Huella de Carbono</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerHouse">
            ${country.map((u, i) => `
              <tr>
                <td>${baseIndex+ i + 1}</td>
                <td>${u.name}</td>
                <td>${u.carbonFootprint}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-country" data-id="${u.idCountry}" data-bs-toggle="modal" data-bs-target="#CountryModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-country" data-id="${u.idCountry}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
     `
}

export async function insertCountry(nombrePais, huellaCarbono, form){
    const playload = {
        name: nombrePais.value.trim(),
        carbonFootprint:huellaCarbono.value.trim()
    }
    try{
        console.log(playload)
        const res = await CountryService.insertCountry(playload)
        form.reset()
        return res
    }
    catch(err){
        Alerts.showToastCloseError(`No se pudo agregar el país ${err}`);
        return { ok: false };
    }
}

export async function updateCountry( nombrePais, huellaCarbono, form, idtxt){
     const playload= {
         idCountry:idtxt.value,
         name: nombrePais.value.trim(),
         carbonFootprint: huellaCarbono.value.trim()
     }
     console.log(playload)
     try{
         const res = await CountryService.updateCountry(playload, idtxt);
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
     const pagination = document.getElementById('countryPagination')
     if(!pagination) return;
     pagination.innerHTML = "";
 
     const prev = document.createElement("li");
     prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
     prev.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`
     
     prev.addEventListener("click", (e)=>{
          e.preventDefault();
          if(current > 0){
          currentPage = current -1; //Retrocede una página
 
         reloadCountry(container);
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
                 reloadCountry(container);
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
       reloadCountry(container);
     }
   });
   pagination.appendChild(next);
 }