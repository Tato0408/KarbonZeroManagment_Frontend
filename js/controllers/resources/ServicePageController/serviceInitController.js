import { init } from "./unitServiceController.js";
import { serviceInit } from "./serviceController.js";

export async function initAllServiceTabs(container) {
  const $tabList = container.querySelector("#tabList");
  $tabList.innerHTML = `
        <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#unitServiceTab">Unidad de Servicios</a>
        </li>
        <li class="nav-item d-flex">
            <a class="nav-link" data-bs-toggle="tab" href="#serviceTab">Servicios</a>
        </li>
     `;
  init(container);
  serviceInit(container);
}
