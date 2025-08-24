import * as FoodService from "../../../services/resources/foodService"
import * as Alerts from '../../../../utils/alerts'

//Metodo de inicio que se llama en el foodPage.js
export async function init(container){
    //Se manda a llamar al contenedor con el metodo init
    renderData(container);
}

let currentPage = 0;
let currentSize = 10;

//Metodo reload y el container sera igual al contenedor que le estemos pasando, en este caso el final en page va a ser el de food

export async function reload(container){
    //Si el container es nulo
    if(!container) return;
    //Si no hacemos un Get y le pasamos el array del alimento y el tab que queremos agregarle al grid
    try{
        const data = await FoodService.getFood(currentPage, currentSize);
        const foods = data.content; 
        const $tabContent = container.querySelector('#tabContent');
        LoadTable(foods, $tabContent);
        ///Llamamos a renderPagination para que siempre pues vaya cambiando en base a la pagina y numero en el cual se encuentre al hacer reload\
        renderPagination(data.number, data.totalPages, container);
    }
    catch (e){
        console.error(e)
    }
}

//Función para renderizar los datos y eventos del formulario
 async function renderData(container){
    const $tabList = container.querySelector('#tabList');
    const $tabContent = container.querySelector('#tabContent')

    //Array donde se guardara el alimento
    let foods = [];

    //Llenamos el alimento
    try{
        //Traemos al json en data
        const data =  await FoodService.getFood(currentPage, currentSize);

        //Acceder al content de eso
        foods = data.content;

        renderPagination(data.number, data.totalPages, container)
    }
    catch(error) {
    console.error(error);
    return container.innerHTML = `<p class="text-danger">No se ha sido posible cargar el alimento.</p>`;
    }

     ///Aca definimos nuestros tabs y de igual forma a donde estan dirigidos, puedes definir varios en page, y cada uno debe tener su div con ru ID 
     $tabList.innerHTML = `
         <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#food">Alimentos</a>
        </li>
        <li class="nav-item d-flex">
            <a class="nav-link" data-bs-toggle="tab" href="#categoriesTab">Categorias de Alimentos</a>
        </li>
     `
    ///Cargamos datos, pasamos nuestros usuarios y nuestro contenedor
     LoadTable(foods, $tabContent);

     const sizeSelector = document.getElementById("itemsSelect")
     sizeSelector.addEventListener("change", ()=>{
        currentSize = parseInt(sizeSelector.value),
        currentPage = 0;
        reload(container);
     });

     //Aca definimos que hace el botón de eliminar
     container.addEventListener('click', async e =>{
        const btn = e.target.closest('.btn-delete-food');
        if(!btn) return;
        const id = btn.dataset.id;
        console.log(id)
        const ok = await FoodService.deleteFood(id);
        console.log(ok)
        //En caso de que duvuelva true retornamos
        if(ok) await reload(container);
     });

     ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
     container.addEventListener('click', async e =>{
        const editBtn =  e.target.closest('.btn-edit-food');
        if(!editBtn) return;
        const id = editBtn.dataset.id;
        try{
            console.log(id)
            const food = await FoodService.getFoodById(id);
            console.log(food)
            
          let ola =  document.getElementById('idtxt').value = food.idFood ?? '';
            document.getElementById('nombreAlimento').value = food.foodName ?? '';
           let ola2= document.getElementById('categoriaAlimento').value = food.idFoodCategory ?? '';

        }
        
        catch (err){
        Alerts.showToastCloseError('No ha sido posible cargar los alimentos');
        console.error(err);
        }
     })
 }
///Aca cargamos nuestros alimentos, eso si en lugar del id mandamos un numero, por que pues si, usamos RAW

 export function LoadTable(foods, tab){
    ///EL base index nos sirve para que siempre se guarden las filas que llevamos en pase a la pagina y su tamaño
    const baseIndex  = currentPage * currentSize;
    tab.innerHTML = "";
    tab.innerHTML = `
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0">
                <i class="bi bi-search"></i>
            </span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="findFood">
        </div>
                <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto ">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#AlimentoModal">
                <i class="bi bi-plus-circle"></i> Añadir Alimento
            </button>
        </div>
    </div>
    <div id="food" class="tab-pane fade show active">
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
          <tbody id="containerFood">
            ${foods.map((u, i) => `
              <tr>
                <td>${baseIndex+ i + 1}</td>
                <td>${u.foodName}</td>
                <td>${u.categoryName}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-food" data-id="${u.idFood}" data-bs-toggle="modal" data-bs-target="#AlimentoModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-food" data-id="${u.idFood}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`
    
 }

 export function loadCategories(categories, categoriesSelect) {
    categoriesSelect.innerHTML = ''
    categoriesSelect.innerHTML += `<option value="">Selecciona una Categoria</option>`
  categories.forEach(element => {
    categoriesSelect.innerHTML += `
        <option value="${element.idFoodCategory}">${element.foodCategoryName}</option>
      `
  });
}

 export async function insertFood(nombreAlimento,nombreCategoria, form){
    const playload = {
        foodName: nombreAlimento.value.trim(),
        idFoodCategory: nombreCategoria.value,
        
    }
    try{
        console.log(playload)
        const res = await FoodService.insertFood(playload);
        form.reset()
        return res;
    }
    catch(err){
        Alerts.showToastCloseError(`No se pudo agregar los alimentos ${err}`);
    ///Retornamos un false
    return { ok: false };
    }

 }

 export async function updateFood( nombreAlimento, categoriaAlimento, form, idtxt){
    const playload= {
        idFood:idtxt.value,
        foodName: nombreAlimento.value.trim(),
        idFoodCategory: categoriaAlimento.value.trim()
    }
    console.log(playload)
    try{
        const res = await FoodService.updateFood(playload, idtxt);
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
    const pagination = document.getElementById('foodPagination')
    if(!pagination) return;
    pagination.innerHTML = "";

    const prev = document.createElement("li");
    prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
    prev.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`
    
    prev.addEventListener("click", (e)=>{
         e.preventDefault();
         if(current > 0){
         currentPage = current -1; //Retrocede una página

        reload(container);
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
      currentPage = current + 1;///Avanza una pagina
      reload(container);
    }
  });
  pagination.appendChild(next);
}