import * as ChannelService from "../../../services/resources/ChannelService.js"
import * as Alerts from "../../../../utils/alerts.js"

export async function init(container){
    renderData(container);
}

let currentPage = 0;
let currentSize = 10;

export async function reload(container) {
    if(!container) return;

    try{
        const data = await ChannelService.getChannels(currentPage, currentSize);
        const companies = data.content;
        const $tabContent = content.querySelector('#tabContent');
        LoadTable(companies, $tabContent);

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

    let companies = [];


    try{
        //Traemos al json en data
        const data =  await ChannelService.getChannels(currentPage, currentSize);

        //Acceder al content de eso
        companies = data.content;

        renderPagination(data.number, data.totalPages, container)
    }
    catch(error) {
    console.error(error);
    return container.innerHTML = `<p class="text-danger">No se ha sido posible cargar el canal.</p>`;
    }

     ///Aca definimos nuestros tabs y de igual forma a donde estan dirigidos, puedes definir varios en page, y cada uno debe tener su div con ru ID 
     $tabList.innerHTML = `
         <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#channel">Canales</a>
        </li>
     `
    ///Cargamos datos, pasamos nuestros usuarios y nuestro contenedor
     LoadTable(companies, $tabContent);

     const sizeSelector = document.getElementById("itemsSelect")
     sizeSelector.addEventListener("change", ()=>{
        currentSize = parseInt(sizeSelector.value),
        currentPage = 0;
        reload(container);
     });

     //Aca definimos que hace el botón de eliminar
     container.addEventListener('click', async e =>{
        const btn = e.target.closest('.btn-delete-channel');
        if(!btn) return;
        const id = btn.dataset.id;
        console.log(id)
        const ok = await ChannelService.deleteChannel(id);
        console.log(ok)
        //En caso de que duvuelva true retornamos
        if(ok) await reload(container);
     });

     ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
     container.addEventListener('click', async e =>{
        const editBtn =  e.target.closest('.btn-edit-channel');
        if(!editBtn) return;
        const id = editBtn.dataset.id;
        try{
            console.log(id)
            const channel = await ChannelService.getChannelById(id);
            console.log(channel)
            
            let ola =  document.getElementById('idtxt').value = channel.idChannel ?? '';
            let ola2= document.getElementById('nombreCanal').value = channel.channelName ?? '';
            document.getElementById('Compañia').value = channel.idCompany ?? '';

        }
        
        catch (err){
        Alerts.showToastCloseError('No ha sido posible cargar los canales');
        console.error(err);
        }
     })
}


export function LoadTable(companies, tab){
    ///EL base index nos sirve para que siempre se guarden las filas que llevamos en pase a la pagina y su tamaño
    const baseIndex  = currentPage * currentSize;
    tab.innerHTML = "";
    tab.innerHTML = `
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0">
                <i class="bi bi-search"></i>
            </span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="findChannel">
        </div>
                <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto ">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#CanalModal">
                <i class="bi bi-plus-circle"></i> Añadir Canal
            </button>
        </div>
    </div>
    <div id="channel" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Categoria</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerChannel">
            ${companies.map((u, i) => `
              <tr>
                <td>${baseIndex+ i + 1}</td>
                <td>${u.channelName}</td>
                <td>${u.idCompany}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-channel" data-id="${u.idChannel}" data-bs-toggle="modal" data-bs-target="#CanalModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-channel" data-id="${u.idChannel}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`
}

export function loadCompanies(companies, companySelect) {
    companySelect.innerHTML = ''
    companySelect.innerHTML += `<option value="">Selecciona una Compañia</option>`
  companies.forEach(element => {
    companySelect.innerHTML += `
        <option value="${element.idCompany}">${element.companyName}</option>
      `
    });
}

export async function insertChannel(nombreCanal, nombreCompañia, form) {
    const playload = {
        channelName: nombreCanal.value.trim(),
        idCompany: nombreCompañia.value.trim(),
    }
    try{
        console.log(playload)
        const res = await ChannelService.insertChannel(playload);
        form.reset()
        return res;
    }
    catch(err){
        Alerts.showToastCloseError(`No se pudo agregar el canal ${err}`)
        return {ok: false}
    }
}

export async function updateChannel(nombreCanal, nombreCompañia, form, idtxt){
    const playload= {
        idChannel:idtxt.value,
        channelName: nombreCanal.value.trim(),
        idCompany: nombreCompañia.value.trim()
    }
    console.log(playload)
    try{
        const res = await ChannelService.updateChannel(playload, idtxt);
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
    const pagination = document.getElementById('channelPagination')
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