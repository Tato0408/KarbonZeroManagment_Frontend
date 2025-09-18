import {init} from "./usersController";

export async function initAllUserTabs(container) {
    const $tabList = container.querySelector("#tabList");
    $tabList.innerHTML = `
         <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="#adminTab">Administradores</a>
        </li>
        <li class="nav-item d-flex">
            <a class="nav-link" data-bs-toggle="tab" href="#userTab">Usuarios</a>
        </li>
     `
    init(container);
    // initCategory(container);
}