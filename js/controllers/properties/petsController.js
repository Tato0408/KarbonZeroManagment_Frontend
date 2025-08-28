import * as PetService from "../../services/properties/petsService";
import * as Alerts from '../../../utils/alerts';

let currentPage = 0;
let currentSize = 10;

export async function PetsInit(container) {
    try {
        renderData(container);
    } catch (err) {
        console.error(`Error inicializando mascotas: ${err}`);
    }
}

export async function reloadPet(container) {
    if (!container) return;
    try {
        const data = await PetService.getPets(currentPage, currentSize);
        const pets = data.content;
        const tab = container.querySelector('#tabContent');
        LoadTable(pets, tab);
        renderPagination(data.number, data.totalPages, container);
    } catch (err) {
        console.error(err);
    }
}

async function renderData(container) {
    let pets = [];
    try {
        const data = await PetService.getPets(currentPage, currentSize);
        pets = data.content;
    } catch (err) {
        console.error("ERROR: ", err);
        container.innerHTML = `<p class="text-danger">No se pudieron cargar las mascotas.</p>`;
        return;
    }

    const tab = container.querySelector('#tabContent');
    const $tabList = container.querySelector("#tabList");
    $tabList.innerHTML = `<li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="mascotas">Mascotas</a></li>`;

    LoadTable(pets, tab);

    const sizeSelector = document.getElementById('itemsSelect');
    sizeSelector.addEventListener("change", () => {
        currentSize = parseInt(sizeSelector.value);
        currentPage = 0;
        reloadPet(container);
    });

    container.addEventListener('click', async e => {
        const btn = e.target.closest('.btn-delete-pet');
        if (!btn) return;
        const id = btn.dataset.id;
        const ok = await PetService.deletePetType(id);
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
        } catch (err) {
            Alerts.showToastCloseError('No ha sido posible cargar la mascota');
            console.error(err);
        }
    });
}

export function LoadTable(pets, tab) {
    const baseIndex = currentPage * currentSize;
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
          <tbody>
            ${pets.map((p, i) => `
              <tr>
                <td>${baseIndex + i + 1}</td>
                <td>${p.name}</td>
                <td>${p.carbonFootprint}</td>
                <td>
                  <button class="btn btn-sm btn-success me-1 btn-edit-pet" data-id="${p.idPet}" data-bs-toggle="modal" data-bs-target="#PetModal"><i class="bi bi-pencil-fill"></i></button>
                  <button class="btn btn-sm btn-danger btn-delete-pet" data-id="${p.idPet}"><i class="bi bi-trash-fill"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

export async function insertPet(nombreMascota, huellaCarbono, form) {
    const payload = { name: nombreMascota.value.trim(), carbonFootprint: huellaCarbono.value.trim() };
    try {
        const res = await PetService.insertPet(payload);
        form.reset();
        return res;
    } catch (err) {
        Alerts.showToastCloseError(`No se pudo agregar la mascota ${err}`);
        return { ok: false };
    }
}

export async function updatePetType(nombreMascota, huellaCarbono, form, idtxt) {
    const payload = { idPet: idtxt.value, name: nombreMascota.value.trim(), carbonFootprint: huellaCarbono.value.trim() };
    try {
        const res = await PetService.updatePetType(payload, idtxt);
        form.reset();
        return res;
    } catch (err) {
        Alerts.showToastCloseError(`No se pueden actualizar los datos ${err}`);
        return { ok: false };
    }
}

export function renderPagination(current, totalPages, container) {
    const pagination = document.getElementById('petPagination');
    if (!pagination) return;
    pagination.innerHTML = "";

    const prev = document.createElement("li");
    prev.className = `page-item ${current <= 0 ? "disabled" : ""}`;
    prev.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    prev.addEventListener("click", e => { e.preventDefault(); if (current > 0) { currentPage--; reloadPet(container); } });
    pagination.appendChild(prev);

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === current ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
        li.addEventListener("click", e => { e.preventDefault(); if (currentPage !== i) { currentPage = i; reloadPet(container); } });
        pagination.appendChild(li);
    }

    const next = document.createElement("li");
    next.className = `page-item ${current >= totalPages - 1 ? "disabled" : ""}`;
    next.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    next.addEventListener("click", e => { e.preventDefault(); if (current < totalPages - 1) { currentPage++; reloadPet(container); } });
    pagination.appendChild(next);
}
