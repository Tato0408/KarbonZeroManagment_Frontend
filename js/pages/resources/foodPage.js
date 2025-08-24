import * as FoodController from '../../controllers/resources/foodPageController/foodController';
import * as FoodCategoryController from '../../controllers/resources/foodPageController/foodCategoryController'
import { getCategories } from '../../services/resources/foodCategoryService';
import { initAllResourcesTabs } from "../../controllers/resources/foodPageController/foodInitController";

export async function render() {
    return `
    
<div class="container py-4" id="foods-root">
    <h2 class="general-title">Alimentos</h2>
    <div 
    class="modal fade" 
    id="AlimentoModal" 
    tabindex="-1"
     role="dialog"
     aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title" id="titleAlimento">Crear alimento</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal"
                        aria-label="Close" id="closebtn"></button>
                </div>
                <form id="AlimentoForm">
                    <div class="modal-body mx-3">
                        <label for="nombreAlimento" class="form-label">Nombre</label>
                        <input id="nombreAlimento" 
                        type="text" 
                        class="form-control" 
                        placeholder="Nombre del alimento">
                        <label for="categoriaAlimento" 
                        class="form-label mt-3">Categoría</label>
                        <select id="categoriaAlimento" 
                        class="form-select"></select>
                        <label for="idtxt"
                         class="form-label d-none">id</label>
                        <input id="idtxt" 
                        type="text" 
                        class="form-control d-none hidden"
                         placeholder="id">

                    </div>
                    <div class="modal-footer d-flex justify-content-center gap-2">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn kz-button-create">Crear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="CategoriaModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title">Crear categoría</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal"
                        aria-label="Close" id="btnCloseCategory"></button>
                </div>
                <form id="CategoriaForm">
                    <div class="modal-body mx-3">
                        <label for="categoriaNombre" class="form-label">Nombre</label>
                        <input id="categoriaNombre" type="text" class="form-control"
                            placeholder="Nombre de la categoría" required>

                        <label for="huellaTxt" class="form-label mt-3">Huella de carbono </label>
                        <input id="huellaTxt" type="text" class="form-control" placeholder="Huella de carbono">
                        <label for="idCategoria" class="form-label mt-3 d-none">Id </label>
                        <input id="idCategoria" type="text" class="form-control d-none" placeholder="Id">
                    </div>
                    <div class="modal-footer d-flex justify-content-center gap-2">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                        <button 
                        type="submit" 
                        class="kz-button-create" 
                        id="addFood-kz"
                        >Crear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <ul class="nav nav-tabs mb-3" id="tabList"></ul>
    <div class="tab-content" id="tabContent"></div>






        //Tabla
        <div class="tab-content" id="tabContentCategory"></div>
    
        


        ///Paginacion
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
            <ul class="pagination mb-0" id="foodPagination">
              
            </ul>
          </nav>
        </div>
      </div>
    </div>

</div>




  `;
}
export async function afterRender() {
    foodProcess();
    foodCategoriesProcess();
}

export async function foodProcess(){
    let data = await getCategories();
    //Se manda a llamar al init del foodController el cual es el que llena la tabla, por eso le pasamos el container
    const container = document.getElementById('foods-root');
    FoodController.init(container)
    //Obtenemos los elementos

    const addFoodBtn = document.querySelector('#addFood-kz');
    const foodName = document.querySelector('#nombreAlimento')
    const foodCategorySelect = document.querySelector('#categoriaAlimento')
    const foodForm = document.querySelector('#AlimentoForm')
    const foodModal = document.querySelector('#AlimentoModal')
    const bsModal = bootstrap.Modal.getOrCreateInstance(foodModal)
    const idFoodHidden = document.querySelector('#idtxt')
    const btnClose = document.querySelector('#closebtn')
    ///Aca mandamos a llenar el loadCategories y le pasamos las categorias que hemos obtenido asi como el formselect
    FoodController.loadCategories(data, foodCategorySelect);
    //Aca definimos que si, el boton exite, limpiaomos los campos al cargar
    if(addFoodBtn){
        addFoodBtn.addEventListener('click', ()=>{
            idFoodHidden.value = ''
            foodName.value = ''
            foodCategorySelect.selectedIndex = 0;
        });
    }
    if(btnClose){
        btnClose.addEventListener('click', ()=>{
            idFoodHidden.value = ''
            foodName.value = ''
            foodCategorySelect.selectedIndex = 0;
        });
    }

    let isLoading = false;
    //Aca ya vinculamos la parte del insert/update con el submit de nuestro formulario, pasamos datos segun sean solicitados
    foodForm.addEventListener('submit', async e =>{
        e.preventDefault();
        if(isLoading) return;
        isLoading = true;
        let res;
        if(idFoodHidden.value){
             res = await FoodController.updateFood(foodName, foodCategorySelect, foodForm, idFoodHidden)
        }else{
            res = await FoodController.insertFood(foodName,foodCategorySelect,foodForm)
        }
        bsModal.hide();
        isLoading = false;
        idFoodHidden.value = ''
        ///Si la respueta que nos retorna ya sea updateFood o insertFood es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
        if(res?.ok){
            await FoodController.reload(container);
        }
    })    
}

export async function foodCategoriesProcess(){
     const container = document.getElementById('foods-root');
    
      FoodCategoryController.initCategory(container);

      const addCategory = document.getElementById('addCategory-kz');
      const closeCategory = document.getElementById('btnCloseCategory')
      const idHidden = document.getElementById('idCategoria');
      const categoryName = document.getElementById('categoriaNombre');
      const carbonFootPrint = document.getElementById('huellaTxt');
      const categoryModal = document.getElementById('CategoriaModal');
      const categoryForm = document.getElementById('CategoriaForm');
      const bsModalCategory = bootstrap.Modal.getOrCreateInstance(categoryModal);
       if (addCategory) {
    addCategory.addEventListener("click", () => {
        idHidden.value = "";
      categoryName.value = "";
      carbonFootPrint.value = "";
     });
    }
    if (closeCategory) {
    closeCategory.addEventListener("click", () => {
        idHidden.value = "";
      categoryName.value = "";
      carbonFootPrint.value = "";
     });
    }

    let isLoading = false;

      categoryForm.addEventListener("submit", async e => {
        e.preventDefault();
        if(isLoading) return
        isLoading = true;
        let respuesta;
    if (idHidden.value) {
      respuesta = FoodCategoryController.updateCategory(idHidden,categoryName,carbonFootPrint,categoryForm);
    } else {
      respuesta =  FoodCategoryController.insertCategory(categoryName,carbonFootPrint,categoryForm);  
      
    }
    bsModalCategory.hide();
        isLoading = false;
        idHidden.value = ''
        ///Si la respueta que nos retorna ya sea updateFood o insertFood es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
        if(respuesta?.ok){
         await FoodCategoryController.reloadCategories(container);
           
           
        }
  });
}




