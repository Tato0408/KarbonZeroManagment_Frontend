import * as FoodCategoryService from "../../../services/resources/foodCategoryService"
import * as Alerts from '../../../../utils/alerts'

export async function initCategory(container){
    try{
        renderCategoryData(container);
    }
    catch(err){
        console.log("Error : ", err)
    }
    
}

let currentPage = 0;
let currentSize = 10;

export async function reloadCategories(container){
    //Si el container es nulo
    if(!container) return;
    //Si no hacemos un Get y le pasamos el array del alimento y el tab que queremos agregarle al grid
    try{
        //Aqui esta la DATA
        const data = await FoodCategoryService.getCategoriesPagination(currentPage, currentSize);
        const foodCategories = data.content; 
        const $tabContent = container.querySelector('#tab-ContentCategory');

        //A este metodo mando la DATA y tambien mando la tabla con los datos
        loadFoodCategoryTable(foodCategories, $tabContent);
        ///Llamamos a renderPagination para que siempre pues vaya cambiando en base a la pagina y numero en el cual se encuentre al hacer reload\
        renderPagination(data.number, data.totalPages, container);
    }
    catch (e){
        console.log(`Error : ${e}`)
    }
}

export async function renderCategoryData(container){
  
    let foodCategories = [];

    try{
        const data = await FoodCategoryService.getCategoriesPagination(currentPage, currentSize);

        foodCategories = data.content
    }
    catch (err){
        console.log("ERROR: ", err  )
        return container.innerHTML = `<p class="text-danger">No se pudieron cargar los recursos.</p>`;
    }

    const categoryTab = container.querySelector("#tab-ContentCategory");

    loadFoodCategoryTable(foodCategories, categoryTab);

    const sizeSelector = container.querySelector("#itemsSelect")
     sizeSelector.addEventListener("change", ()=>{
        currentSize = parseInt(sizeSelector.value),
        currentPage = 0;
        reloadCategories(container);
     });    


     container.addEventListener('click', async e => {
        const btn = e.target.closest('.btn-delete-category');
        if (!btn) return;
        const id = btn.dataset.id;
        await FoodCategoryService.deleteFoodCategory(id);
        await reloadCategories(container);   
    });
    container.addEventListener('click', async e => {
        const editBtn = e.target.closest('.btn-edit-category');
        if (editBtn) {
            const id = editBtn.dataset.id;
            try {
                const category = await FoodCategoryService.getFoodCategoryById(id);
                document.getElementById('categoriaNombre').value = category.foodCategoryName;
                document.getElementById('huellaTxt').value = category.carbonFootPrint;
                document.querySelector('#idCategoria').value = category.idFoodCategory;
            } catch (err) {
                Alerts.showToastCloseError('No se pudo cargar la categoria');
                console.error(err);
            }
            return;
        }
    });
}

//Categories es la data que sacamos del metodo GET, y tab es la tabla y definimos lo que va a tener la tabla junto al MODAL
function loadFoodCategoryTable(categories, tab){
    tab.innerHTML = `
        <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
          <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
              <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="findCategory">
          </div>
          <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
              <button class="kz-button-create" id="addCategory-kz" data-bs-toggle="modal"
            data-bs-target="#CategoriaModal"><i class="bi bi-plus-circle"></i>
                  Crear categoria
              </button>
          </div>
    </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Huella de Carbono</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${categories.map((c, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${c.foodCategoryName}</td>
                <td>${c.carbonFootPrint}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-category" data-id="${c.idFoodCategory}" data-bs-toggle="modal" data-bs-target="#CategoriaModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-category" data-id="${c.idFoodCategory}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
    </div>
    `
}

export async function insertCategory(categoryName, carbonFootPrint, categoryForm) {
    const payload = {
        foodCategoryName: categoryName.value.trim(),
        carbonFootPrint: carbonFootPrint.value.trim()
    }
    try {
      let res =   FoodCategoryService.insertFoodCategory(payload);
        await reloadCategories(container); 
        categoryForm.reset();
        return res;
    } catch (err) {
        Alerts.showToastCloseError(`No se pudo agregar la categoria de alimento`)
    }
}

export async function updateCategory(idCategory, categoryName,  carbonFootprint, categoryForm) {
    const playload = {
        idFoodCategory: idCategory.value,
        foodCategoryName: categoryName.value.trim(),
        carbonFootPrint: carbonFootprint.value.trim()
        
    }
    try {
        FoodCategoryService.updateFoodCategory(playload, idCategory);
        
        const prueba =await reloadCategories(container); 
        console.log(prueba)
        categoryForm.reset();
    } catch (err) {
        Alerts.showToastCloseError(`No se pudo actualizar la categoria`)
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

        reloadCategories(container);
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
                reloadCategories(container);
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
      reloadCategories(container);
    }
  });
  pagination.appendChild(next);
}