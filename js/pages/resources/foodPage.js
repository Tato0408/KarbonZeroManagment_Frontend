export async function render() {
    return `
<div class="container py-4">
    <h2 class="general-title">Alimentos</h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0">
                <i class="bi bi-search"></i>
            </span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" id="button-kz"></button>
        </div>
    </div>

    <div class="modal fade" id="AlimentoModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title">Crear alimento</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form id="AlimentoForm">
                    <div class="modal-body mx-3">
                        <label for="nombreAlimento" class="form-label">Nombre</label>
                        <input id="nombreAlimento" type="text" class="form-control" placeholder="Nombre del alimento">
                        <label for="categoriaAlimento" class="form-label mt-3">Categoría</label>
                        <input id="categoriaAlimento" type="text" class="form-control" placeholder="Categoría">
                    </div>
                    <div class="modal-footer d-flex justify-content-center gap-2">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn kz-button-create">Crear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="CategoriaModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title">Crear categoría</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form id="CategoriaForm">
                    <div class="modal-body mx-3">
                        <label for="categoriaNombre" class="form-label">Nombre</label>
                        <input id="categoriaNombre" type="text" class="form-control"
                            placeholder="Nombre de la categoría" required>

                        <label for="huellaTxt" class="form-label mt-3">Huella de carbono </label>
                        <input id="huellaTxt" type="text" class="form-control" placeholder="Huella de carbono">
                    </div>
                    <div class="modal-footer d-flex justify-content-center gap-2">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn kz-button-create">Crear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <ul class="nav nav-tabs mb-3" id="tabList"></ul>
    <div class="tab-content" id="tabContent"></div>
</div>
  `;
}
export function afterRender() {

}
