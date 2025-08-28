import * as FuelTypeService from "../../../services/resources/servicesService"
import * as Alerts from '../../../utils/alerts'

export async function FuelTypeInit(container) {
    try {
        renderData(container)
    }
    catch (err) {
        console.log(`Error : ${err}`)
    }
}

let currentPage = 0;
let currentSize = 10;

export async function reloadFuelType(container) {
    if (!container) return

    try {
        const data = await FuelTypeService.getAllFuelType(currentPage, currentSize)
        const fuelType = data.content
        const $tabContent = container.querySelector('#tabContent')
        LoadTable(fuelType, $tabContent)

        renderPagination(data.number, data.totalPages, container)
    }
    catch (err) {
        console.error(e)
    }
}

async function renderData(container) {
    let fuelType = []

    try {
        const data = await FuelTypeService.getAllFuelType(currentPage, currentSize)

        fuelType = data.content
    }
    catch {
        console.log("ERROR: ", err)
        return container.innerHTML = `<p class="text-danger">No se pudieron cargar los recursos.</p>`;
    }

    const tab = container.querySelector('#tabContent')
    const $tabList = container.querySelector("#tabList");
    $tabList.innerHTML = `
                <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="servicios">Tipo de combustible</a>
        </li>
        `
    LoadTable(fuelType, tab)
    const sizeSelector = document.getElementById('itemsSelect')
    sizeSelector.addEventListener("change", () => {
        currentSize = parseInt(sizeSelector.value);
        currentPage = 0;
        reloadFuelType(container)
    })
    container.addEventListener('click', async e => {
        const btn = e.target.closest('.btn-delete-fuelType');
        if (!btn) return;
        const id = btn.dataset.id;
        const ok = await FuelTypeService.deleteFuelType(id);
        console.log(ok)
        //En caso de que duvuelva true retornamos
        if (ok) await reloadFuelType(container);
    });

    ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
    container.addEventListener('click', async e => {
        const editBtn = e.target.closest('.btn-edit-fuelType');
        if (!editBtn) return;
        const id = editBtn.dataset.id;
        try {
            const fuelType = await FuelTypeService.getFuelTypeById(id);
            document.getElementById('idtxt').value = fuelType.idFuelType ?? '';
            document.getElementById('nombretxt').value = fuelType.name ?? '';
            document.getElementById('unidadmedidatxt').value = fuelType.measureUnit ?? '';
            document.getElementById('huellacarbontxt').value = fuelType.carbonFootprint ?? '';
        }

        catch (err) {
            Alerts.showToastCloseError('No ha sido posible cargar los tipos de combustible');
            console.error(err);
        }
    })
}

export function LoadTable(fuelType, tab){
    const baseIndex  = currentPage * currentSize;
     tab.innerHTML = "";
     console.log("Datos de FuelType en LoadTable:", fuelType);
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
            ${fuelType.map((u, i) => `
              <tr>
                <td>${baseIndex+ i + 1}</td>
                <td>${u.name}</td>
                <td>${u.measureUnit}</td>
                <td>${u.carbonFootprint}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-fuelType" data-id="${u.idFuelType}" data-bs-toggle="modal" data-bs-target="#FuelTypeModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-fuelType" data-id="${u.idFuelType}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
     `
}

export async function insertFuelType(nombreServicio, unidadMedida, huellaCarbono, form){
    const playload = {
        name: nombreServicio.value.trim(),
        measureUnit: unidadMedida.value.trim(),
        carbonFootprint:huellaCarbono.value.trim()
    }
    try{
        console.log(playload)
        const res = await FuelTypeService.insertFuelType(playload)
        form.reset()
        return res
    }
    catch(err){
        Alerts.showToastCloseError(`No se pudo agregar el tipo de combustible ${err}`);
        return { ok: false };
    }
}

export async function updateFuelType( nombreServicio, unidadMedida, huellaCarbono, form, idtxt){
     const playload= {
         idFuelType:idtxt.value,
         name: nombreServicio.value.trim(),
         measureUnit: unidadMedida.value.trim(),
         carbonFootprint: huellaCarbono.value.trim()
     }
     console.log(playload)
     try{
         const res = await FuelTypeService.updateFuelType(playload, idtxt);
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
     const pagination = document.getElementById('fuelTypePagination')
     if(!pagination) return;
     pagination.innerHTML = "";
 
     const prev = document.createElement("li");
     prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
     prev.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`
     
     prev.addEventListener("click", (e)=>{
          e.preventDefault();
          if(current > 0){
          currentPage = current -1; //Retrocede una página
 
         reloadFuelType(container);
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
                 reloadFuelType(container);
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
       reloadFuelType(container);
     }
   });
   pagination.appendChild(next);
 }