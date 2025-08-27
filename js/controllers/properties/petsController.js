import * as PetService from "../../services/properties/petsService"
import * as Alerts from '../../../utils/alerts'

export async function PetsInit(container) {
    try {
        renderData(container)
    }
    catch (err) {
        console.log(`Error : ${err}`)
    }
}

let currentPage = 0;
let currentSize = 10;

export async function reloadPet(container) {
    if (!container) return

    try {
        const data = await PetService.getPets(currentPage, currentSize)
        const pet = data.content
        const $tabContent = container.querySelector('#tabContent')
        LoadTable(pet, $tabContent)

        renderPagination(data.number, data.totalPages, container)
    }
    catch (err) {
        console.error(e)
    }
}

async function renderData(container) {
    let pet = []

    try {
        const data = await PetService.getPets(currentPage, currentSize)

        pet = data.content
    }
    catch {
        console.log("ERROR: ", err)
        return container.innerHTML = `<p class="text-danger">No se pudieron cargar los recursos.</p>`;
    }

    const tab = container.querySelector('#tabContent')
    const $tabList = container.querySelector("#tabList");
    $tabList.innerHTML = `
                <li class="nav-item d-flex">
            <a class="nav-link active" data-bs-toggle="tab" href="mascotas">Mascotas</a>
        </li>
        `
    LoadTable(pet, tab)
    const sizeSelector = document.getElementById('itemsSelect')
    sizeSelector.addEventListener("change", () => {
        currentSize = parseInt(sizeSelector.value);
        currentPage = 0;
        reloadPet(container)
    })
    container.addEventListener('click', async e => {
        const btn = e.target.closest('.btn-delete-pet');
        if (!btn) return;
        const id = btn.dataset.id;
        const ok = await PetService.deletePetType(id);
        console.log(ok)
        if (ok) await reloadPet(container);
    });

    container.addEventListener('click', async e => {
        const editBtn = e.target.closest('.btn-edit-pet');
        if (!editBtn) return;
        const id = editBtn.dataset.id;
        try {
            const pet = await PetService.getPetTypeById(id);
            document.getElementById('idtxt').value = pet.idPet ?? '';
            document.getElementById('nombretxt').value = pet.name ?? '';
            document.getElementById('huellacarbontxt').value = pet.carbonFootprint ?? '';
        }

        catch (err) {
            Alerts.showToastCloseError('No ha sido posible cargar las mascotas');
            console.error(err);
        }
    })
}

export function LoadTable(pet, tab) {
    const baseIndex = currentPage * currentSize;
    tab.innerHTML = "";
    console.log("Datos de pet en LoadTable:", pet);
    tab.innerHTML = `
        <div id="paises" class="tab-pane fade show active">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
                <th>#</th>
                <th>Tipo de mascota</th>
                <th>Huella de Carbono</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="containerPet">
            ${pet.map((u, i) => `
              <tr>
                <td>${baseIndex + i + 1}</td>
                <td>${u.name}</td>
                <td>${u.carbonFootprint}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btn-edit-pet" data-id="${u.idPet}" data-bs-toggle="modal" data-bs-target="#PetModal"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-sm btn-danger btn-delete-pet" data-id="${u.idPet}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
     `
}

export async function insertPet(nombreMascota, huellaCarbono, form) {
    const playload = {
        name: nombreMascota.value.trim(),
        carbonFootprint: huellaCarbono.value.trim()
    }
    try {
        console.log(playload)
        const res = await PetService.insertPet(playload)
        form.reset()
        return res
    }
    catch (err) {
        Alerts.showToastCloseError(`No se pudo agregar la mascota ${err}`);
        return { ok: false };
    }
}

export async function updatePetType(nombreMascota, huellaCarbono, form, idtxt) {
    const playload = {
        idPet: idtxt.value,
        name: nombreMascota.value.trim(),
        carbonFootprint: huellaCarbono.value.trim()
    }
    console.log(playload)
    try {
        const res = await PetService.updatePetType(playload, idtxt);
        console.log(res)
        form.reset();
        return res;
    }
    catch (err) {
        Alerts.showToastCloseError(`No se pueden actualizar los datos ${err}`);
        console.log(err);
        return { ok: false };
    }
}

export function renderPagination(current, totalPages, container) {
    const pagination = document.getElementById('petPagination')
    if (!pagination) return;
    pagination.innerHTML = "";

    const prev = document.createElement("li");
    prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
    prev.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`

    prev.addEventListener("click", (e) => {
        e.preventDefault();
        if (current > 0) {
            currentPage = current - 1;

            reloadPet(container);
        }
    });

    pagination.appendChild(prev);

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement("li");
        li.className = ` page-item ${i === current ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`
        li.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentPage !== i) {
                currentPage = i;
                reloadPet(container);
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
            reloadPet(container);
        }
    });
    pagination.appendChild(next);
}