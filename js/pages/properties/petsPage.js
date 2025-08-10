export async function render() {
    return `
<div class="container py-4">
    <h2 class="general-title">
        Mascota
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#PetModal">
                <i class="bi bi-plus-circle"></i> Añadir Mascota
            </button>
        </div>
    </div>
    <div class="modal fade" id="PetModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Compañia</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="PetForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6">
                                <label for="nombretxt" class="form-label">Tipo de mascota</label>
                                <input id="nombretxt" type="text" class="form-control" placeholder="Tipo de mascota">
                            </div>
                            <div class="col-sm-6">
                                <label for="huellacarbontxt" class="form-label">Huella de carbono</label>
                                <input id="huellacarbontxt" type="number" class="form-control" placeholder="Huella de carbono">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" id="btn-add-pets" class="btn kz-button-create">Guardar</button>
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
