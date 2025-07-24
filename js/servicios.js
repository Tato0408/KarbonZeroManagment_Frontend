function initServices() {
    const tabsData = [
        {
            id: 'servicios',
            columns: [
                { label: 'ID', field: 'id' },
                { label: 'Servicio', field: 'servicio' },
                { label: 'Unidad de medida', field: 'unidad' },
                { label: 'Huella de carbono', field: 'huella' }
            ],
            data: [
                { id: 1, servicio: "Transporte público", unidad: "km recorrido", huella: "0.1 tCO₂e" },
                { id: 2, servicio: "Internet residencial", unidad: "mes", huella: "0.05 tCO₂e" },
                { id: 3, servicio: "Recolección de residuos", unidad: "tonelada", huella: "0.7 tCO₂e" },
                { id: 4, servicio: "Energía eléctrica", unidad: "kWh", huella: "0.3 tCO₂e" },
                { id: 5, servicio: "Transporte aéreo", unidad: "km recorrido", huella: "0.2 tCO₂e" },
                { id: 6, servicio: "Gas natural residencial", unidad: "m³", huella: "0.15 tCO₂e" },
                { id: 7, servicio: "Servicio de televisión por cable", unidad: "mes", huella: "0.03 tCO₂e" },
                { id: 8, servicio: "Transporte privado (automóvil)", unidad: "km recorrido", huella: "0.25 tCO₂e" },
                { id: 9, servicio: "Alumbrado público", unidad: "kWh", huella: "0.12 tCO₂e" },
                { id: 10, servicio: "Suministro de agua potable", unidad: "m³", huella: "0.02 tCO₂e" }
            ]
        }
    ];

    renderTabs(tabsData);
    initServiceModal();
}

function initServiceModal() {
    const modal = document.querySelector('#ServiceModal');
    if (!modal) return;
    window.serviceModal = bootstrap.Modal.getOrCreateInstance(modal);
}

document.getElementById('ServiceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    window.serviceModal.hide();
});

function renderTabs(tabsData) {
    const tabList = document.getElementById('tabList');
    const tabContent = document.getElementById('tabContent');

    tabList.innerHTML = '';
    tabContent.innerHTML = '';

    tabsData.forEach((tab, idx) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
      <a class="nav-link ${idx === 0 ? 'active' : ''}" data-bs-toggle="tab" href="#${tab.id}">
        Servicios
      </a>
    `;
        tabList.appendChild(li);

        const pane = document.createElement('div');
        pane.className = `tab-pane fade${idx === 0 ? ' show active' : ''}`;
        pane.id = tab.id;
        pane.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              ${tab.columns.map(c => `<th class="accion">${c.label}</th>`).join('')}
              <th class="accion">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <nav class="d-flex justify-content-center mt-2">
        <ul class="pagination mb-0"></ul>
      </nav>
    `;
        tabContent.appendChild(pane);

        setupPagination(pane, tab.data, tab.columns);
    });
}

function setupPagination(pane, data, columns) {
    const tbody = pane.querySelector('tbody');
    const pagination = pane.querySelector('.pagination');
    let currentPage = 1;
    const itemsPerPage = 10;

    function renderTablePage() {
        const start = (currentPage - 1) * itemsPerPage;
        const rows = data.slice(start, start + itemsPerPage);

        tbody.innerHTML = rows.map(r => `
      <tr>
        ${columns.map(c => `<td class="accion">${r[c.field] ?? ''}</td>`).join('')}
        <td class="accion">
          <button class="btn btn-sm btn-success me-1" data-bs-toggle="modal" data-bs-target="#ServiceModal">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-sm btn-danger">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      </tr>
    `).join('');
    }

    function renderPagination() {
        const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, data.length);

        pagination.innerHTML = '';

        const info = document.createElement('span');
        info.className = 'text-muted me-3';
        info.textContent = `Mostrando ${start}-${end} de ${data.length}`;
        pagination.appendChild(info);

        const ul = document.createElement('ul');
        ul.className = 'pagination mb-0';
        pagination.appendChild(ul);

        const addBtn = (label, page, disabled = false, active = false) => {
            const li = document.createElement('li');
            li.className = `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`;
            li.innerHTML = `<button class="page-link">${label}</button>`;
            if (!disabled && !active) li.firstChild.addEventListener('click', () => {
                currentPage = page;
                renderTablePage();
                renderPagination();
            });
            ul.appendChild(li);
        };

        addBtn('«', currentPage - 1, currentPage === 1);
        for (let i = 1; i <= totalPages; i++) addBtn(i, i, false, i === currentPage);
        addBtn('»', currentPage + 1, currentPage === totalPages);
    }

    renderTablePage();
    renderPagination();
}

window.initServices = initServices();
