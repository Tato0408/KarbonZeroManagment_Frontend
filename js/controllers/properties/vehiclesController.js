import * as VehicleService from "../../services/properties/vehiclesService"
import * as Alerts from '../../../utils/alerts'

export async function CarSizeInit(container) {
    try {
        renderData(container)
    }
    catch (err) {
        console.log(`Error : ${err}`)
    }
}

let currentPage = 0;
let currentSize = 10;

export async function reloadCarSize(container) {
    if (!container) return

    try {
        const data = await VehicleService.getCarSize(currentPage, currentSize)
        const carSize = data.content
        const $tabContent = container.querySelector('#tabContent')
        LoadTable(carSize, $tabContent)

        renderPagination(data.number, data.totalPages, container)
    }
    catch (err) {
        console.error(e)
    }
}

async function renderData(container) {
    let carSize = []

    try {
        const data = await VehicleService.getCarSize(currentPage, currentSize)

        carSize = data.content
    }
    catch {
        console.log("ERROR: ", err)
        return container.innerHTML = `<p class="text-danger">No se pudieron cargar los recursos.</p>`;
    }

    const tab = container.querySelector('#tabContent')
    const $tabList = container.querySelector("#tabList");
    $tabList.innerHTML = `
                <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="carros">Vehiculos</a>
        </li>
        `
    LoadTable(carSize, tab)
    const sizeSelector = document.getElementById('itemsSelect')
    sizeSelector.addEventListener("change", () => {
        currentSize = parseInt(sizeSelector.value);
        currentPage = 0;
        reloadCarSize(container)
    })
    container.addEventListener('click', async e => {
        const btn = e.target.closest('.btn-delete-carSize');
        if (!btn) return;
        const id = btn.dataset.id;
        const ok = await VehicleService.deleteCarSize(id);
        console.log(ok)
        //En caso de que duvuelva true retornamos
        if (ok) await reloadCarSize(container);
    });

    ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
    container.addEventListener('click', async e => {
        const editBtn = e.target.closest('.btn-edit-carSize');
        if (!editBtn) return;
        const id = editBtn.dataset.id;
        try {
            const carSize = await VehicleService.getCarSizeById(id);
            document.getElementById('idtxt').value = carSize.idCarSize ?? '';
            document.getElementById('nombretxt').value = carSize.name ?? '';
        }

        catch (err) {
            Alerts.showToastCloseError('No ha sido posible cargar los tamaños de carros');
            console.error(err);
        }
    })
}

export function LoadTable(carSize, tab){
    const baseIndex  = currentPage * currentSize;
     tab.innerHTML = "";
     console.log("Datos de carSize en LoadTable:", carSize);
     tab.innerHTML = `
        <div id="paises" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerHouse">
            ${carSize.map((u, i) => `
              <tr>
                <td>${baseIndex+ i + 1}</td>
                <td>${u.name}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-carSize" data-id="${u.idCarSize}" data-bs-toggle="modal" data-bs-target="#CarSizeModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-carSize" data-id="${u.idCarSize}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
     `
}

export async function insertCarSize(nombreTamaño, form){
    const playload = {
        name: nombreTamaño.value.trim()
    }
    try{
        console.log(playload)
        const res = await VehicleService.insertCarSize(playload)
        form.reset()
        return res
    }
    catch(err){
        Alerts.showToastCloseError(`No se pudo agregar el tamaño de carro ${err}`);
        return { ok: false };
    }
}

export async function updateCarSize( nombreTamaño, form, idtxt){
     const playload= {
         idCarSize:idtxt.value,
         name: nombreTamaño.value.trim()
     }
     console.log(playload)
     try{
         const res = await VehicleService.updateCarSize(playload, idtxt);
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
     const pagination = document.getElementById('carSizePagination')
     if(!pagination) return;
     pagination.innerHTML = "";
 
     const prev = document.createElement("li");
     prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
     prev.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`
     
     prev.addEventListener("click", (e)=>{
          e.preventDefault();
          if(current > 0){
          currentPage = current -1; //Retrocede una página
 
         reloadCarSize(container);
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
                 reloadCarSize(container);
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
       reloadCarSize(container);
     }
   });
   pagination.appendChild(next);
 }