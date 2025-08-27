import * as CarSizeService from "../../../services/resources/CarSizeService.js"
import * as Alerts from "../../../../utils/alerts.js"

export async function init(container){
    renderData(container);
}

let currentPage = 0;
let currentSize = 10;

export async function reload(container) {
    if(!container) return;

    try{
        const data = await CarSizeService.getCarSize(currentPage, currentSize);
        const carSize = data.content;
        const $tabContent = content.querySelector('#tabContent');
        LoadTable(carSize, $tabContent);

        renderPagination(data.number, data.totalPages, container);
    }
    catch(e){
        console.error(e)
    }
}

//Función para renderizar los datos y eventos del formulario
async function renderData(container){
    const $tabList = container.querySelector('#tabList');
    const $tabContent = container.querySelector('#tabContent')

    let carSize = [];


    try{
        //Traemos al json en data
        const data =  await CarSizeService.getCarSize(currentPage, currentSize);

        //Acceder al content de eso
        carSize = data.content;

        renderPagination(data.number, data.totalPages, container)
    }
    catch(error) {
    console.error(error);
    return container.innerHTML = `<p class="text-danger">No se ha sido posible cargar el tamaño de carro.</p>`;
    }

     ///Aca definimos nuestros tabs y de igual forma a donde estan dirigidos, puedes definir varios en page, y cada uno debe tener su div con ru ID 
     $tabList.innerHTML = `
         <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#carsize">Tamaño de Vehiculos</a>
        </li>
     `
    ///Cargamos datos, pasamos nuestros usuarios y nuestro contenedor
     LoadTable(carSize, $tabContent);

     const sizeSelector = document.getElementById("itemsSelect")
     sizeSelector.addEventListener("change", ()=>{
        currentSize = parseInt(sizeSelector.value),
        currentPage = 0;
        reload(container);
     });

     //Aca definimos que hace el botón de eliminar
     container.addEventListener('click', async e =>{
        const btn = e.target.closest('.btn-delete-carsize');
        if(!btn) return;
        const id = btn.dataset.id;
        console.log(id)
        const ok = await CarSizeService.deleteCarSize(id);
        console.log(ok)
        //En caso de que duvuelva true retornamos
        if(ok) await reload(container);
     });

     ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
     container.addEventListener('click', async e =>{
        const editBtn =  e.target.closest('.btn-edit-carsize');
        if(!editBtn) return;
        const id = editBtn.dataset.id;
        try{
            console.log(id)
            const carsize = await CarSizeService.getCarSizeById(id);
            console.log(carsize)
            
            let ola =  document.getElementById('idtxt').value = carsize.idCarSize ?? '';
            document.getElementById('nombreTamañoCarro').value = carsize.carSizeName ?? '';

        }
        
        catch (err){
        Alerts.showToastCloseError('No ha sido posible cargar los tamaños de carros');
        console.error(err);
        }
     })
}


export function LoadTable(carSize, tab){
    ///EL base index nos sirve para que siempre se guarden las filas que llevamos en pase a la pagina y su tamaño
    const baseIndex  = currentPage * currentSize;
    tab.innerHTML = "";
    tab.innerHTML = `
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0">
                <i class="bi bi-search"></i>
            </span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="findCarSize">
        </div>
                <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto ">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#TamañoCarroModal">
                <i class="bi bi-plus-circle"></i> Añadir tamaño de carro
            </button>
        </div>
    </div>
    <div id="carSize" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerCarSize">
            ${carSize.map((u, i) => `
              <tr>
                <td>${baseIndex+ i + 1}</td>
                <td>${u.carSizeName}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-carSize" data-id="${u.idCarSize}" data-bs-toggle="modal" data-bs-target="#TamañoCarroModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-carSize" data-id="${u.idCarSize}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`
}

export async function insertCarSize(nombreTamañoCarro, form) {
    const playload = {
        carSizeName: nombreTamañoCarro.value.trim()
    }
    try{
        console.log(playload)
        const res = await CarSizeService.insertCarSize(playload);
        form.reset()
        return res;
    }
    catch(err){
        Alerts.showToastCloseError(`No se pudo agregar el tamaño de carro ${err}`)
        return {ok: false}
    }
}

export async function updateCarSize(nombreTamañoCarro, form, idtxt){
    const playload= {
        idCarSize:idtxt.value,
        carSizeName: nombreTamañoCarro.value.trim()
    }
    console.log(playload)
    try{
        const res = await CarSizeService.updateCarSize(playload, idtxt);
        console.log(res)
        form.reset();
        return res;
    }
    catch(err){
        Alerts.showToastCloseError(`No se pueden actualizar los datos ${err}`);
        console.log(err);
        return { ok: false };
    }
}

export function renderPagination(current, totalPages, container){
    const pagination = document.getElementById('carSizePagination')
    if(!pagination) return;
    pagination.innerHTML = "";

    const prev = document.createElement("li");
    prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
    prev.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`
    
    prev.addEventListener("click", (e)=>{
         e.preventDefault();
         if(current > 0){
         currentPage = current -1;

        reload(container);
      }
    });

    pagination.appendChild(prev);

    for(let i = 0; i < totalPages; i++){
        const li = document.createElement("li");
        li.className =` page-item ${i === current ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`
        li.addEventListener("click", (e) => {
            e.preventDefault();
            if(currentPage !== i){
                currentPage = i;
                reload(container);
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
      currentPage = current + 1;
      reload(container);
    }
  });
  pagination.appendChild(next);
}