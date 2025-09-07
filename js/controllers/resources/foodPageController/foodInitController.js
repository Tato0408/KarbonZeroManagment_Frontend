import { initCategory } from "./foodCategoryController";
import { init } from "./foodController";


export async function initAllFoodTabs(container) {
 const $tabList = container.querySelector('#tabList');
$tabList.innerHTML = `
         <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#foodTab">Alimentos</a>
        </li>
        <li class="nav-item d-flex">
            <a class="nav-link" data-bs-toggle="tab" href="#categoriesTab">Categorias de Alimentos</a>
        </li>
     `
init(container);
initCategory(container);
    
}
  

  

