export async function render() {
    return `
<div class="container py-4" id="measures-root">
    <h2 class="general-title">Medidas</h2>
    <div class="modal fade" id="MedidaModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title">Crear medida</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form id="MedidaForm">
                    <div class="modal-body mx-3">
                        <label for="medidatxt" class="form-label">Medida</label>
                        <input id="medidatxt" type="text" class="form-control" placeholder="Medida">
                    </div>
                    <div class="modal-footer d-flex justify-content-center gap-2">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn kz-button-create">Crear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal fade" id="UnidadModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header justify-content-center position-relative">
                    <h4 class="kz-modal-title">Crear unidad</h4>
                    <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form id="UnidadForm">
                    <div class="modal-body mx-3">
                        <label for="unidadMedida" class="form-label">Medida</label>
                        <input id="unidadMedida" type="text" class="form-control" placeholder="Medida">
                        <label for="unidadTxt" class="form-label mt-3">Unidad</label>
                        <input id="unidadTxt" type="text" class="form-control" placeholder="Unidad de medida">
                    </div>
                    <div class="modal-footer d-flex justify-content-center gap-2">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn kz-button-create">Crear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Esto despues lo tienen que injectar junto a la tabla, ya que este es un tab con mas de una pestaña -->
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0">
                <i class="bi bi-search"></i>
            </span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" id="btn-add-measures">Agregar medidas</button>
        </div>
    </div>
    <ul class="nav nav-tabs mb-3" id="tabList"></ul>
    <div class="tab-content" id="tabContent"></div>
</div>
  `;
}
export function afterRender() {

}
