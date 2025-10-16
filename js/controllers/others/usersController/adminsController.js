import * as UserService from "../../../services/others/usersService.js"
import * as Alerts from '../../../../utils/alerts.js'
import {me} from "../../../services/authService.js"
import { useTransition } from "react";


//Metodo de inicio que se llama en el foodPage.js
export async function init(container) {
  //Se manda a llamar al contenedor con el metodo init
  renderData(container);
}

let currentPage = 0;
let currentSize = 10;
export async function setCurrentPage(page) {
  currentPage = page;
}
//Metodo reload y el container sera igual al contenedor que le estemos pasando, en este caso el final en page va a ser el de food

export async function reload(container) {
  if (!container) return;

  try {
    const search = document.querySelector("#search").value.trim();

    let data;
    if (!search) {
      data = await UserService.getAdmins(currentPage, currentSize);
    } else {
      data = await UserService.getAdminsByName(search, currentPage, currentSize); // <-- faltaba await
    }

    const admins = data.content; // por si viene vacío
    const $tabContent = container.querySelector("#tabContentAdmin");

    LoadTable(admins, $tabContent);
    renderPagination(data.number, data.totalPages, container);
  }
  catch (e) {
    console.error("Error en reload:", e);
  }
}

//Función para renderizar los datos y eventos del formulario
async function renderData(container) {

  const $tabContent = container.querySelector("#tabContentAdmin");

  let admins = []
  try {
    //Traemos al json en data
    admins = await UserService.getAdmins(currentPage, currentSize);
    renderPagination(admins.number, admins.totalPages, container);
  }
  catch (error) {
    console.error(error);
    return container.innerHTML = `<p class="text-danger">No se ha sido posible cargar el administrador.</p>`;
  }

  ///Cargamos datos, pasamos nuestros usuarios y nuestro contenedor
  LoadTable(admins.content, $tabContent);

  const sizeSelector = document.getElementById("adminItemsSelect");
  sizeSelector.addEventListener("change", () => {
    currentSize = parseInt(sizeSelector.value)
    currentPage = 0;
    reload(container);
  });

  // Aca definimos que hace el botón de eliminar
  container.addEventListener("click", async e => {
    const btn = e.target.closest(".btn-ban-admin");
    if (!btn) return;
    const id = btn.dataset.id;

    let ok;
    if (btn.dataset.disabled == 0) {
        const user = await me();

        if (user.data.idUser == btn.dataset.id) {
          Alerts.showToastCloseInfo("No se puede bloquear a usted mismo");
          return;
        }
        ok = await UserService.banUser(id);
    } else {
        ok = await UserService.unbanUser(id);
    }

    if (ok) await reload(container);
  })

  //Aca definimos que hace el botón de eliminar
  container.addEventListener('click', async e => {
    const btn = e.target.closest('.btn-delete-admin');
    if (!btn) return;
    const id = btn.dataset.id;
    const ok = await UserService.deleteUser(id);
    //En caso de que duvuelva true retornamos
    if (ok) await reload(container);
  });

  ///Aca lo que hacemos es llenar el formulario de editar, puesto que eso es lo que hace el boton, abrir con datos, quien se encarga de enviar el PUT es en page
  container.addEventListener('click', async e => {
    const editBtn = e.target.closest('.btn-edit-admin');
    if (!editBtn) return;
    const id = editBtn.dataset.id;
    try {
      const admin = await UserService.getAdminById(id);
      document.getElementById("idtxt").value = admin.idUser ?? "";
      document.getElementById("disabledtxt").value = admin.disabled ?? "";
      document.getElementById("nombretxt").value = admin.firstName ?? "";
      document.getElementById("apellidotxt").value = admin.lastName ?? "";
      document.getElementById("usuariotxt").value = admin.userName ?? "";
      document.getElementById("emailtxt").value = admin.email ?? "";
      document.getElementById("countrySelect").value = admin.idCountry ?? "";
    }

    catch (err) {
      Alerts.showToastCloseError('No ha sido posible cargar los alimentos');
      console.error(err);
    }
  })
}
///Aca cargamos nuestros alimentos, eso si en lugar del id mandamos un numero, por que pues si, usamos RAW

export function LoadTable(admins, tab) {
  ///EL base index nos sirve para que siempre se guarden las filas que llevamos en pase a la pagina y su tamaño
  const baseIndex = currentPage * currentSize;
  tab.innerHTML = "";
  tab.innerHTML = `
  <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Nombre de Usuario</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>País</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${admins
              .map(
                (u, i) => `
              <tr ${u.disabled == 1 ? 'class="table-secondary"' : ''}>
                <td>${baseIndex + i + 1}</td>
                <td>${u.userName}</td>
                <td>${u.firstName}</td>
                <td>${u.lastName}</td>
                <td>${u.email}</td>
                <td>${u.disabled == 1 ? "Bloqueado" : "Activo"}</td>
                <td>${u.countryName}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-admin" data-id="${
                      u.idUser
                    }" data-bs-toggle="modal" data-bs-target="#usersModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-warning btn-ban-admin me-1" data-disabled="${u.disabled}" data-id="${
                      u.idUser
                    }"><i class="bi bi-person-fill-slash"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-admin" data-id="${
                      u.idUser
                    }"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>`;

}

export function loadCountries(countries, countriesSelect) {
  countriesSelect.innerHTML = "";
  countries.forEach((element) => {
    countriesSelect.innerHTML += `
        <option value="${element.idCountry}">${element.name}</option>
      `;
  });
}

export async function insertAdmin(username, firstname, lastname, email, imagePath, idcountry, form) {
  const payload = {
    userName: username.value.trim(),
    firstName: firstname.value.trim(),
    lastName: lastname.value.trim(),
    email: email.value.trim(),
    passwordUser: generateRandomPassword().trim(),
    status: 1,
    disabled: 0,
    idCountry: idcountry.value.trim(),
  };
  try {
    const res = await UserService.insertUser(payload);
    form.reset()
    return res;
  }
  catch (err) {
    Alerts.showToastCloseError(`No se pudo agregar el usuario: ${err}`);
    ///Retornamos un false
    return { ok: false };
  }

}

export async function updateAdmin(
  username,
  firstname,
  lastname,
  email,
  imagePath,
  idcountry,
  disabled,
   id,
  form
) {
  const payload = {
    idUser: id.value.trim(),
    userName: username.value.trim(),
    firstName: firstname.value.trim(),
    lastName: lastname.value.trim(),
    email: email.value.trim(),
    status: 1,
    disabled: disabled.value,
    idCountry: idcountry.value.trim(),
  };
  try {
    const res = await UserService.updateUser(idtxt.value.trim(), payload);
    form.reset();
    return res;
  } catch (err) {
    Alerts.showToastCloseError(`No se pueden actualizar el administrador ${err}`);
    console.log(err);
    ///Retornamos un false
    return { ok: false };
  }
}

export function renderPagination(current, totalPages, container) {
  //Acá accedemos al ul de paginación
  const pagination = document.querySelector("#adminPagination");
  if (!pagination) return;
  pagination.innerHTML = "";

  const prev = document.createElement("li");
  prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
  prev.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`

  prev.addEventListener("click", (e) => {
    e.preventDefault();
    if (current > 0) {
      currentPage = current - 1; //Retrocede una página

      reload(container);
    }
  });

  pagination.appendChild(prev);

  //Control de número de páginas

  for (let i = 0; i < totalPages; i++) {
    const li = document.createElement("li");
    li.className = ` page-item ${i === current ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`
    li.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage !== i) {
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

function generateRandomPassword(length = 8) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "abcdefghijklmnopqrstuvwxyz" +
    "0123456789" +
    "!@#$%^&*()_-+={}[]";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * charset.length);
    password += charset[randIndex];
  }
  return password;
}