import { initAllUserTabs } from "../../controllers/others/usersController/usersInitController.js";
import * as AdminController from "../../controllers/others/usersController/adminsController.js";
import * as UserController from "../../controllers/others/usersController/usersController.js";
import { getCountriesList } from "../../services/others/countriesService.js";
import * as Validations from "../../../utils/validations.js";
import * as Alerts from "../../../utils/alerts.js";

export async function render() {
  return `
<div class="py-4 px-2" id="userContainer">
    <h2 class="general-title">
        Usuarios
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar" id="search">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button id="addButton" class="kz-button-create" data-bs-toggle="modal" data-bs-target="#usersModal">
                <i class="bi bi-plus-circle"></i> Crear usuario
            </button>
        </div>
    </div>
    <!--MODAL DE USUARIOS-->
    <div class="modal fade" id="usersModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Usuarios</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="adminForm">
                    <div class="modal-body mx-3">
                        <div class="col-sm-6 d-none">
                            <label for="idtxt" class="form-label">Id</label>
                            <input id="idtxt" type="text" class="form-control">
                            <label for="disabledtxt" class="form-label">Disabled</label>
                            <input id="disabledtxt" type="text" class="form-control">
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6">
                                <label for="nombretxt" class="form-label">Nombre</label>
                                <input id="nombretxt" type="text" class="form-control" placeholder="Nombre">
                            </div>
                            <div class="col-sm-6">
                                <label for="apellidotxt" class="form-label">Apellido</label>
                                <input id="apellidotxt" type="text" class="form-control" placeholder="Apellido">
                            </div>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6">
                                <label for="usuariotxt" class="form-label">Usuario</label>
                                <input id="usuariotxt" type="text" class="form-control" placeholder="Usuario">
                            </div>
                            <div class="col-sm-6">
                                <label for="emailtxt" class="form-label">Correo Electronico</label>
                                <input id="emailtxt" type="email" class="form-control" placeholder="Correo Electronico">
                            </div>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6">
                                <label for="countrySelect" class="form-label">País</label>
                                <select id="countrySelect" class="form-select">
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer d-flex justify-content-center">
                            <button type="submit" class="btn kz-button-create">Guardar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <ul class="nav nav-tabs mb-3" id="tabList"></ul>
    <div class="tab-content" id="tabContent">
        <div class="tab-pane fade show active" id="adminTab">
            <!--TABLA DE CONTENIDOS-->
            <div id="tabContentAdmin"></div>
            <!--PAGINACIÓN-->
            <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                <div class="col-auto d-flex justify-content-start">
                    <select class="form-select" aria-label="Items por pagina" id="adminItemsSelect">
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="col d-flex justify-content-end">
                    <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                        <ul id="adminPagination" class="pagination mb-0"></ul>
                    </nav>
                </div>
            </div>
        </div>
        <div class="tab-pane fade show" id="userTab">
            <!--TABLA DE CONTENIDOS-->
            <div id="tabContentUser"></div>
            <!--PAGINACIÓN-->
            <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
                <div class="col-auto d-flex justify-content-start">
                    <select class="form-select" aria-label="Items por pagina" id="userItemsSelect">
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="col d-flex justify-content-end">
                    <nav aria-label="Page navigation example" class="d-flex justify-content-center">
                        <ul id="userPagination" class="pagination mb-0"></ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</div>
  `;
}
export async function afterRender() {
  const container = document.querySelector("#userContainer");
  const addButton = document.querySelector("#addButton");

  initAllUserTabs(container);

  const countries = await getCountriesList();

  const idTxt = document.querySelector("#idtxt");
  const nameTxt = document.querySelector("#nombretxt");
  const lastnameTxt = document.querySelector("#apellidotxt");
  const userTxt = document.querySelector("#usuariotxt");
  const emailTxt = document.querySelector("#emailtxt");
  const disabledTxt = document.querySelector("#disabledtxt")
  const countrySelect = document.querySelector("#countrySelect");
  const image = document.querySelector("#imagen");
  const adminForm = document.querySelector("#adminForm");
  const adminModal = document.querySelector("#usersModal");
  const bsAdminModal = bootstrap.Modal.getOrCreateInstance(adminModal);

  AdminController.loadCountries(countries, countrySelect);

  addButton.addEventListener("click", () => {
    idTxt.value = "";
    nameTxt.value = "";
    lastnameTxt.value = "";
    userTxt.value = "";
    emailTxt.value = "";
    countrySelect.selectedIndex = 0;
  });

  nameTxt.addEventListener("keypress", (e) => Validations.textValidation(e));
  lastnameTxt.addEventListener("keypress", (e) =>
    Validations.textValidation(e)
  );
  userTxt.addEventListener("keypress", (e) => Validations.textValidation(e));
  emailTxt.addEventListener("keypress", (e) => Validations.emailValidation(e));

  let isLoading = false;
  adminForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!userTxt.value.trim()) {
      Alerts.showToastCloseError("El nombre usuario es obligatorio");
      return;
    }

    if (!emailTxt.value.trim()) {
      Alerts.showToastCloseError("El correo eléctronico es obligatorio");
      return;
    }

    const regex =
      /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
    if (!regex.test(emailTxt.value.trim())) {
      Alerts.showToastCloseError(
        "EL correo eléctronico no tiene un estrucura válida"
      );
    }

    if (isLoading) return;
    isLoading = true;

    let res;
    if (idTxt.value) {
      res = await AdminController.updateAdmin(
        userTxt,
        nameTxt,
        lastnameTxt,
        emailTxt,
        image,
        countrySelect,
        disabledTxt,
        idTxt,
        adminForm
      );
    } else {
      res = await AdminController.insertAdmin(
        userTxt,
        nameTxt,
        lastnameTxt,
        emailTxt,
        image,
        countrySelect,
        adminForm
      );
    }
    bsAdminModal.hide();
    isLoading = false;
    idTxt.value = "";

    if (res?.ok) {
      await AdminController.reload(container);
    }
  });

  // ---- Search para medidas y unidades ----
  const searchInput = container.querySelector("#search");

  searchInput.addEventListener("keypress", (e) =>
    Validations.textValidation(e)
  );

  if (searchInput) {
    searchInput.addEventListener("keyup", async (e) => {
      if (e.key === "Enter" || searchInput.value == "") {
        // Medidas
        if (document.querySelector("#adminTab").classList.contains("show")) {
          AdminController.setCurrentPage(0);
          await AdminController.reload(container);
        }
        // Unidades
        if (document.querySelector("#userTab").classList.contains("show")) {
          UserController.setCurrentPage(0);
          await UserController.reload(container);
        }
      }
    });
  }

  // ---- Mostrar solo botón de admins ----
  addButton.style.display = "block";
  document.querySelectorAll("#tabList .nav-link").forEach((tab) => {
    tab.addEventListener("shown.bs.tab", (event) => {
      const target = event.target.getAttribute("href");
      addButton.style.display = target === "#adminTab" ? "block" : "none";
    });
  });
}
