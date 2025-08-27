import * as TransportController from '../../controllers/others/transportationController';

export async function render() {
    return `
<div class="container py-4" id="transport-root">
    <h2 class="general-title">
        Transporte
    </h2>
    <div class="filters-bar d-flex align-items-center gap-3 p-3 mb-3 rounded-3 flex-nowrap" style="background:#f5f5f5;">
        <div class="input-group search-bar flex-grow-1" style="max-width: 400px;">
            <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 bg-transparent" placeholder="Buscar">
        </div>
        <div class="d-flex align-items-center gap-2 flex-nowrap ms-auto">
            <button class="kz-button-create" data-bs-toggle="modal" data-bs-target="#TransportModal" id="addTransport-kz">
                <i class="bi bi-plus-circle"></i> Añadir Transporte
            </button>
        </div>
    </div>
    <div class="modal fade" id="TransportModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content kz-modal-mongo border-0">
                <div class="modal-header" style="justify-content: center; position: relative;">
                    <h4 class="kz-modal-title" id="exampleModalLongTitle">Transporte</h4>
                    <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                        data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <form id="TransportForm">
                    <div class="modal-body mx-3">
                        <div class="row g-2 mb-3">
                            <div class="col-sm-6 d-none">
                                <label for="idtxt" class="form-label">id</label>
                                <input id="idtxt" type="text" class="form-control" placeholder="id">
                            </div>
                            <div class="col-sm-6">
                                <label for="nombretxt" class="form-label">Nombre</label>
                                <input id="nombretxt" type="text" class="form-control" placeholder="Nombre">
                            </div>
                            <div class="col-sm-6">
                                <label for="huellacarbontxt" class="form-label">Huella de carbono</label>
                                <input id="huellacarbontxt" type="number" class="form-control" placeholder="Huella de carbono">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button type="submit" class="btn kz-button-create">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <ul class="nav nav-tabs mb-3" id="tabList"></ul>
    <div class="tab-content" id="tabContent"></div>
    <!-- Paginación -->
      <div class="row flex-nowrap mt-2" style="overflow-x: auto;">
        <div class="col-auto d-flex justify-content-start">
          <select class="form-select" aria-label="Items por pagina" id="itemsSelectTransport">
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10" selected>10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div class="col d-flex justify-content-end">
          <nav aria-label="Page navigation example" class="d-flex justify-content-center">
            <ul class="pagination mb-0" id="userPagination">
              
            </ul>
          </nav>
        </div>
      </div>
</div>
  `;
}
export function afterRender() {
    const container = document.getElementById('transport-root');
    TransportController.init(container);

    const addTransportBtn = document.querySelector('#addTransport-kz');
    const nametxt = document.querySelector('#nombretxt');
    const huellacarbontxt = document.querySelector('#huellacarbontxt');
    const transportForm = document.querySelector('#TransportForm');
    const modalEl = document.getElementById('TransportModal')
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl)
    const idHideen = document.querySelector('#idtxt');

    if (addTransportBtn) {
        addTransportBtn.addEventListener('click', () => {
        idHideen.value = '';
        nametxt.value = '';
        huellacarbontxt.value = '';
        });
    }

    let isLoading = false;

    transportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isLoading) return;
    isLoading = true;
    let res;
    if (idHideen.value) {
      res = await TransportController.updateTransport(nametxt, huellacarbontxt, transportForm, idHideen);
    } else {
      res = await TransportController.insertTransport(nametxt, huellacarbontxt, transportForm);
    }

    bsModal.hide();
    isLoading = false;
    idHideen.value = '';
    ///Si la respueta que nos retorna ya sea updateUser o insertUser es ok en positivo, pues hacemos el reload, como da la respuesta lo pueden ver en el metodo respectivo
    if (res?.ok) {
      await TransportController.reload(container);
    }
  });
}
