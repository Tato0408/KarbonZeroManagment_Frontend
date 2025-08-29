import * as FoodController from '../../controllers/resources/foodPageController/foodController';
import * as FoodCategoryController from '../../controllers/resources/foodPageController/foodCategoryController'
import { getCategories } from '../../services/resources/foodCategoryService';
import { initAllResourcesTabs } from "../../controllers/resources/foodPageController/foodInitController";

export async function render() {
    return `
<div class="py-4" id="foods-root">
    <!--! MODAL ALIMENTO -->
    <div class="modal fade" id="AlimentoModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content kz-modal-mongo border-0">
          <div class="modal-header" style="justify-content: center; position: relative;">
            <h4 class="kz-modal-title" id="titleAlimento">Crear alimento</h4>
            <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
              data-bs-dismiss="modal" aria-label="Close" id="closebtn"></button>
          </div>
          <form id="AlimentoForm">
            <div class="modal-body mx-3">
              <div class="row g-2 mb-3">
                <label for="nombreAlimento" class="form-label">Nombre</label>
                <input id="nombreAlimento" type="text" required class="form-control"
                  placeholder="Nombre del alimento">
              </div>
              <div class="row g-2 mb-3">
                <label for="categoriaAlimento" class="form-label">Categoría</label>
                <select id="categoriaAlimento" required class="form-select"></select>
              </div>
              <div class="row g-2 mb-3 d-none">
                <label for="idtxt" class="form-label">id</label>
                <input id="idtxt" type="text" class="form-control" placeholder="id">
              </div>
            </div>
            <div class="modal-footer d-flex justify-content-center">
              <button type="submit" class="btn kz-button-create">Crear</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!--! MODAL CATEGORÍA -->
    <div class="modal fade" id="CategoriaModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content kz-modal-mongo border-0">
          <div class="modal-header" style="justify-content: center; position: relative;">
            <h4 class="kz-modal-title">Crear categoría</h4>
            <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
              data-bs-dismiss="modal" aria-label="Close" id="btnCloseCategory"></button>
          </div>
          <form id="CategoriaForm">
            <div class="modal-body mx-3">
              <div class="row g-2 mb-3">
                <label for="categoriaNombre" class="form-label">Nombre</label>
                <input id="categoriaNombre" type="text" required class="form-control"
                  placeholder="Nombre de la categoría" required>
              </div>
              <div class="row g-2 mb-3">
                <label for="huellaTxt" class="form-label">Huella de carbono</label>
                <input id="huellaTxt" required type="number" step="0.1" class="form-control" placeholder="Huella de carbono">
              </div>
              <div class="row g-2 mb-3 d-none">
                <label for="idCategoria" class="form-label">Id</label>
                <input id="idCategoria" type="text" class="form-control" placeholder="Id">
              </div>
            </div>
            <div class="modal-footer d-flex justify-content-center">
              <button type="submit" class="btn kz-button-create" id="addFood-kz">Crear</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <h2 class="general-title">Alimentos</h2>
    <ul class="nav nav-tabs mb-3" id="tabList"></ul>

    <div class="tab-content" id="tabContent-foods">
      <!-- TAB ALIMENTOS -->
      <div class="tab-pane fade show active" id="foodTab">
        <!-- filtros alimentos -->
        <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap"
          style="background:#f5f5f5;">
          <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" id="searchFood" placeholder="Buscar">
          </div>
          <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#AlimentoModal">
              <i class="bi bi-plus-circle"></i> Añadir Alimento
            </button>
          </div>
        </div>
        <!-- contenido alimentos -->
        <div id="tabContent"></div>
        <!-- paginación alimentos -->
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
              <ul id="foodPagination" class="pagination mb-0"></ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- TAB CATEGORÍAS -->
      <div class="tab-pane fade" id="categoriesTab">
        <!-- filtros categorías -->
        <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap"
          style="background:#f5f5f5;">
          <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="searchCategory">
          </div>
          <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#CategoriaModal">
              <i class="bi bi-plus-circle"></i> Añadir Categoría
            </button>
          </div>
        </div>
        <!-- contenido categorías -->
        <div id="tabContentCategory"></div>
        <!-- paginación categorías -->
        <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
          <div class="col-auto d-flex justify-content-start">
            <select class="form-select" aria-label="Items por pagina" id="itemsSelectCategory">
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          <div class="col d-flex justify-content-end">
            <nav aria-label="Page navigation example" class="d-flex justify-content-center">
              <ul id="foodPaginationCategory" class="pagination mb-0"></ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
 `;
}
export async function afterRender() {
    const container = document.getElementById('foods-root');
    await initAllResourcesTabs(container);
    foodProcess();
    foodCategoriesProcess();
}

export async function foodProcess() {
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
    const search = document.querySelector('#searchFood')

    search.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            FoodController.setCurrentPage(0);
            FoodController.reload(container);
        }
        if (search.value == "") {
            FoodController.reload(container)
        }
    })
    ///Aca mandamos a llenar el loadCategories y le pasamos las categorias que hemos obtenido asi como el formselect
    FoodController.loadCategories(data, foodCategorySelect);
    //Aca definimos que si, el boton exite, limpiaomos los campos al cargar
    if (addFoodBtn) {
        addFoodBtn.addEventListener('click', () => {
            idFoodHidden.value = ''
            foodName.value = ''
            foodCategorySelect.selectedIndex = 0;
        });
    }
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            idFoodHidden.value = ''
            foodName.value = ''
            foodCategorySelect.selectedIndex = 0;
        });
    }

    document.getElementById("nombreAlimento").addEventListener("keypress", function (e) {
        let char = String.fromCharCode(e.which); // la tecla presionada
        let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/; // solo letras y espacios
        if (!regex.test(char)) {
            e.preventDefault(); // cancela la tecla
        }
    });

    let isLoading = false;
    //Aca ya vinculamos la parte del insert/update con el submit de nuestro formulario, pasamos datos segun sean solicitados
    foodForm.addEventListener('submit', async e => {
        e.preventDefault();
        if (isLoading) return;
        isLoading = true;
        let res;
        if (idFoodHidden.value) {
            res = await FoodController.updateFood(foodName, foodCategorySelect, foodForm, idFoodHidden)
        } else {
            res = await FoodController.insertFood(foodName, foodCategorySelect, foodForm)
        }
        bsModal.hide();
        isLoading = false;
        idFoodHidden.value = ''
        ///Si la respueta que nos retorna ya sea updateFood o insertFood es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
        if (res?.ok) {
            await FoodController.reload(container);
        }
    })
}

export async function foodCategoriesProcess() {
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
    const search = document.querySelector('#searchCategory')
    search.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            FoodCategoryController.setCurrentPage(0);
            FoodCategoryController.reloadCategories(container);
        }
        if (search.value == "") {
            FoodCategoryController.reloadCategories(container)
        }
    })

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

    document.getElementById("categoriaNombre").addEventListener("keypress", function (e) {
        let char = String.fromCharCode(e.which); // la tecla presionada
        let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/; // solo letras y espacios
        if (!regex.test(char)) {
            e.preventDefault(); // cancela la tecla
        }
    });

    document.getElementById("huellaTxt").addEventListener("keypress", function (e) {
        let val = String.fromCharCode(e.which);
        let p = e.target.value;

        //Permitir numeros y punto
        if (!/[0-9.]/.test(val)) {
            e.preventDefault();
            return;
        }

        //Validacion para no permitir mas de un punto de decimal
        if (val === "." && p.includes(".")) {
            e.preventDefault();
            return;
        }

        //No mas de dos decimales despues del punto
        if (p.includes(".")) {
            let parte = p.split(".");
            if (parte[1].length >= 2 && e.target.selectionStart > p.indexOf(".")) {
                e.preventDefault();
                return;
            }
        }
    });

    let isLoading = false;

    categoryForm.addEventListener("submit", async e => {
        e.preventDefault();
        if (isLoading) return
        isLoading = true;
        let respuesta;
        if (idHidden.value) {
            respuesta = FoodCategoryController.updateCategory(idHidden, categoryName, carbonFootPrint, categoryForm);
        } else {
            respuesta = FoodCategoryController.insertCategory(categoryName, carbonFootPrint, categoryForm);

        }
        bsModalCategory.hide();
        isLoading = false;
        idHidden.value = ''
        ///Si la respueta que nos retorna ya sea updateFood o insertFood es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
        if (respuesta?.ok) {
            await FoodCategoryController.reloadCategories(container);


        }
    });
}




