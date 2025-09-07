import * as MeasureService from "../../services/measures/measureService.js";
import * as Alerts from "../../../utils/alerts.js";

let currentPage = 0;
let currentSize = 10;

export function setCurrentPage(page) {
    currentPage = page;
}

export function setPageSize(size) {
    currentSize = size;
}

export async function init(container) {
    await renderData(container);
}

export async function reload(container) {
    if (!container) return;
    try {
        const searchMeasure = document.querySelector('#findMeasure')?.value.trim() || '';
        let data;
        if (!searchMeasure) {
            data = await MeasureService.getMeasure(currentPage, currentSize);
        } else {
            data = await MeasureService.getMeasureByName(searchMeasure, currentPage, currentSize);
        }
        const measures = data.content;
        const tab = container.querySelector('#tabContent');
        loadTable(measures, tab, container);
        renderPagination(data.number, data.totalPages, container);
    } catch (err) {
        console.error(err);
    }
}

async function renderData(container) {
    const tab = container.querySelector("#tabContent");
    try {
        const data = await MeasureService.getMeasure(currentPage, currentSize);
        loadTable(data.content, tab, container);
        renderPagination(data.number, data.totalPages, container);
    } catch (err) {
        console.error(err);
        tab.innerHTML = `<p class="text-danger">No se pudo cargar la medida.</p>`;
    }
}

function loadTable(measures, tab, container) {
    const baseIndex = currentPage * currentSize;
    tab.innerHTML = `
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Medida</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${measures.map((m, i) => `
                    <tr>
                        <td>${baseIndex + i + 1}</td>
                        <td>${m.nameMeasure}</td>
                        <td>
                            <button class="btn btn-sm btn-success me-1 btn-edit-measure" data-id="${m.idMeasure}" data-bs-toggle="modal" data-bs-target="#MedidaModal">
                                <i class="bi bi-pencil-fill"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-delete-measure" data-id="${m.idMeasure}">
                                <i class="bi bi-trash-fill"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>`;

    // Editar medida
    tab.querySelectorAll('.btn-edit-measure').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const measure = await MeasureService.getMeasureById(id);
            if (!measure) return;
            document.getElementById('nombreMedida').value = measure.nameMeasure;
            document.getElementById("idtxt").value = measure.idMeasure;
        });
    });

    // Eliminar medida
    tab.querySelectorAll('.btn-delete-measure').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const ok = await MeasureService.deleteMeasure(id);
            if (ok) reload(container);
        });
    });
}

export async function insertMeasure(nombreMedida, form) {
    const payload = { nameMeasure: nombreMedida.value.trim() };
    try {
        const res = await MeasureService.insertMeasure(payload);
        form.reset();
        return res;
    } catch (err) {
        Alerts.showToastCloseError(`No se pudo agregar la medida: ${err}`);
        return { ok: false };
    }
}

export async function updateMeasure(nombreMedida, form, idtxt) {
    const id = idtxt.value.trim()
    const payload = { idMeasure: id, nameMeasure: nombreMedida.value.trim() };
    try {
        const res = await MeasureService.updateMeasure(id, payload);
        form.reset();
        return res;
    } catch (err) {
        Alerts.showToastCloseError(`No se pudieron actualizar los datos: ${err}`);
        return { ok: false };
    }
}

// Paginación
function renderPagination(current, totalPages, container) {
    const pagination = container.querySelector('#measurePagination');
    if (!pagination) return;
    pagination.innerHTML = '';

    const prev = document.createElement('li');
    prev.className = `page-item ${current <= 0 ? 'disabled' : ''}`;
    prev.innerHTML = `<a class="page-link" href="#">&laquo;</a>`;
    prev.addEventListener('click', e => { e.preventDefault(); if (current > 0) { currentPage--; reload(container); } });
    pagination.appendChild(prev);

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === current ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
        li.addEventListener('click', e => { e.preventDefault(); currentPage = i; reload(container); });
        pagination.appendChild(li);
    }

    const next = document.createElement('li');
    next.className = `page-item ${current >= totalPages - 1 ? 'disabled' : ''}`;
    next.innerHTML = `<a class="page-link" href="#">&raquo;</a>`;
    next.addEventListener('click', e => { e.preventDefault(); if (current < totalPages - 1) { currentPage++; reload(container); } });
    pagination.appendChild(next);
}
