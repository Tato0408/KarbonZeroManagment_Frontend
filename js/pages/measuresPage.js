import * as MeasureController from '../controllers/measurePageController/measureController.js';
import * as MeasureUnitController from '../controllers/measurePageController/measureUnitController.js';

export async function render() {
    return `
<div class="container py-4" id="measures-root">
    <h2 class="general-title">Medidas</h2>

    <!-- Modal Crear/Editar Medida -->
    <div class="modal fade" id="MedidaModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title">Medida</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="MedidaForm" class="p-3">
                    <label for="nombreMedida" class="form-label">Medida</label>
                    <input id="nombreMedida" type="text" pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+" class="form-control" placeholder="Nombre de la medida">
                    <input id="idtxt" type="text" class="form-control d-none" placeholder="id">
                    <div class="modal-footer d-flex justify-content-center gap-2 mt-3">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn kz-button-create" id="addMeasure-kz">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Crear/Editar Unidad -->
    <div class="modal fade" id="UnidadModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title">Unidad</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="UnidadForm" class="p-3">
                    <label for="selectMeasureUnit" class="form-label">Medida</label>
                    <select id="selectMeasureUnit" class="form-select">
                        <option value="">Seleccione medida</option>
                    </select>

                    <label for="unidadTxt" class="form-label mt-3">Unidad de medida</label>
                    <input id="unidadTxt" type="text" required class="form-control" placeholder="Unidad de medida">

                    <input id="idUnidad" type="text" class="form-control d-none">

                    <div class="modal-footer d-flex justify-content-center gap-2 mt-3">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn kz-button-create" id="addUnit-kz">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent"  id="findMeasure" placeholder="Buscar">
        </div>

        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button id="btn-add-measures" class="kz-button-create" data-bs-toggle="modal" data-bs-target="#MedidaModal">Agregar medida</button>
            <button id="btn-add-unidad" class="kz-button-create" data-bs-toggle="modal" data-bs-target="#UnidadModal">Agregar unidad</button>
        </div>
    </div>

    <!-- Tabs Medidas / Unidades -->
    <ul class="nav nav-tabs mb-3" id="tabList">
        <li class="nav-item">
            <a class="nav-link active" data-bs-toggle="tab" href="#measureTab">Medidas</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#unitTab">Unidades de medida</a>
        </li>
    </ul>

    <div class="tab-content">
        <div class="tab-pane fade show active" id="measureTab">
            <div id="tabContent"></div>
        </div>
        <div class="tab-pane fade" id="unitTab">
            <div id="tab-ContentUnit"></div>
        </div>
    </div>

    <!-- Paginación -->
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
                <ul class="pagination mb-0" id="measurePagination"></ul>
            </nav>
        </div>
    </div>
</div>
`;
}

export async function afterRender() {
    const container = document.getElementById('measures-root');

    // Inicializar medidas y unidades
    await MeasureController.init(container);
    await MeasureUnitController.initUnit(container);

    // ---- Form Medida ----
    const measureForm = document.getElementById('MedidaForm');
    const addMeasureBtn = document.getElementById('btn-add-measures');
    const idMeasureHidden = document.getElementById('idtxt');
    const measureName = document.getElementById('nombreMedida');
    const measureModal = document.getElementById('MedidaModal');
    const bsMeasureModal = bootstrap.Modal.getOrCreateInstance(measureModal);

    addMeasureBtn.addEventListener('click', () => {
        idMeasureHidden.value = '';
        measureName.value = '';
    });

    measureForm.addEventListener('submit', async e => {
        e.preventDefault();
        if (idMeasureHidden.value) {
            await MeasureController.updateMeasure(measureName, measureForm, idMeasureHidden);
        } else {
            await MeasureController.insertMeasure(measureName, measureForm);
        }
        bsMeasureModal.hide();
        await MeasureController.reload(container);
    });

    // ---- Form Unidad ----
    const unidadForm = document.getElementById('UnidadForm');
    const unidadName = document.getElementById('unidadTxt');
    const idUnidadHidden = document.getElementById('idUnidad');
    const unidadModal = document.getElementById('UnidadModal');
    const bsUnitModal = bootstrap.Modal.getOrCreateInstance(unidadModal);

    const addUnidadBtn = document.getElementById('btn-add-unidad');
    addUnidadBtn.addEventListener('click', () => {
        idUnidadHidden.value = '';
        unidadName.value = '';
        document.getElementById("selectMeasureUnit").value = "";
    });

    unidadForm.addEventListener('submit', async e => {
        e.preventDefault();
        if (idUnidadHidden.value) {
            await MeasureUnitController.updateUnit(unidadName, idUnidadHidden, unidadForm);
        } else {
            await MeasureUnitController.insertUnit(unidadName, unidadForm);
        }
        bsUnitModal.hide();
        await MeasureUnitController.reloadUnit(container);
    });

    // ---- Search para medidas y unidades ----
    const searchInput = container.querySelector("#findMeasure");
    if (searchInput) {
        searchInput.addEventListener("keyup", async e => {
            if (e.key === "Enter") {
                // Medidas
                if (document.querySelector('#measureTab').classList.contains('show')) {
                    MeasureController.setCurrentPage(0);
                    await MeasureController.reload(container);
                }
                // Unidades
                if (document.querySelector('#unitTab').classList.contains('show')) {
                    MeasureUnitController.setCurrentPage(0);
                    await MeasureUnitController.reloadUnit(container, searchInput.value.trim());
                }
            }
        });
    }

    // ---- Mostrar solo botón de la pestaña activa ----
    addMeasureBtn.style.display = 'block';
    addUnidadBtn.style.display = 'none';
    document.querySelectorAll('#tabList .nav-link').forEach(tab => {
        tab.addEventListener('shown.bs.tab', event => {
            const target = event.target.getAttribute('href');
            addMeasureBtn.style.display = target === '#measureTab' ? 'block' : 'none';
            addUnidadBtn.style.display = target === '#unitTab' ? 'block' : 'none';
        });
    });

    // ---- Cambiar tamaño de página ----
    const itemsSelect = document.getElementById('itemsSelect');
    itemsSelect.addEventListener('change', async () => {
        const size = parseInt(itemsSelect.value);
        if (!isNaN(size)) {
            MeasureController.setPageSize?.(size);
            MeasureUnitController.setPageSize?.(size);

            if (document.querySelector('#measureTab').classList.contains('show')) {
                await MeasureController.reload(container);
            } else {
                await MeasureUnitController.reloadUnit(container);
            }
        }
    });
}
