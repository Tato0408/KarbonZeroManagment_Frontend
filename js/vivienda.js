function initdwellin() {
  const tabsData = [
  {
    columns: [
      { label: 'ID', field: 'id' },
      { label: 'Vivienda', field: 'vivienda' },
      { label: 'huellaCarbono', field: 'huellaCarbono' }
    ],
    data: [
  { "id": 1, "vivienda": "Casa grande", "huellaCarbono": "12.5 tCO₂e" },
  { "id": 2, "vivienda": "Casa mediana", "huellaCarbono": "9.3 tCO₂e" },
  { "id": 3, "vivienda": "Casa pequeña", "huellaCarbono": "6.7 tCO₂e" },
  { "id": 4, "vivienda": "Departamento grande", "huellaCarbono": "7.8 tCO₂e" },
  { "id": 5, "vivienda": "Departamento pequeño", "huellaCarbono": "5.2 tCO₂e" },
  { "id": 6, "vivienda": "Mansión", "huellaCarbono": "18.9 tCO₂e" },
  { "id": 7, "vivienda": "Casa rural", "huellaCarbono": "4.1 tCO₂e" },
  { "id": 8, "vivienda": "Casa compartida", "huellaCarbono": "3.5 tCO₂e" },
  { "id": 9, "vivienda": "Cabaña", "huellaCarbono": "4.7 tCO₂e" },
  { "id": 10, "vivienda": "Tiny House", "huellaCarbono": "2.9 tCO₂e" }
]

  }
];
    initdwellinModal();
  renderTabs(tabsData);
}
function initdwellinModal(){
  const modal = document.querySelector('#dwellingModal');
  if(!modal) return;
  window.userModal = bootstrap.Modal.getOrCreateInstance(modal);
}
document.getElementById('dwellingForm').addEventListener('submit', (e)=>{
  e.preventDefault();

  window.userModal.hide();
})
function renderTabs(tabsData) {
  const tabList    = document.getElementById('tabList');
  const tabContent = document.getElementById('tabContent');

  tabList.innerHTML    = '';
  tabContent.innerHTML = '';

  tabsData.forEach((tab, idx) => {
    // Crear pestaña (li > a)
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `
      <a class="nav-link ${idx === 0 ? 'active' : ''}" data-bs-toggle="tab" href="#${tab.id}">País
      </a>
    `;
    tabList.appendChild(li);

    // Crear contenido de la pestaña
    const pane = document.createElement('div');
    pane.className = `tab-pane fade${idx === 0 ? ' show active' : ''}`;
    pane.id = tab.id;
    pane.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              ${tab.columns.map(c => `<th>${c.label}</th>`).join('')}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
        <nav class="d-flex justify-content-center mt-2">
          <ul class="pagination mb-0"></ul>
        </nav>
      </div>
    `;
    tabContent.appendChild(pane);

    setupPagination(pane, tab.data, tab.columns);
  });

}

function setupPagination(pane, data, columns) {
  const tbody      = pane.querySelector('tbody');
  const pagination = pane.querySelector('.pagination');

  let currentPage   = 1;
  let itemsPerPage  = 10;

  function renderTablePage() {
    const start = (currentPage - 1) * itemsPerPage;
    const rows  = data.slice(start, start + itemsPerPage);

    tbody.innerHTML = rows.map(r => `
      <tr>
        ${columns.map(c => `<td>${r[c.field] ?? ''}</td>`).join('')}
        <td>
          <button class="btn btn-sm btn-success me-1" data-bs-toggle="modal" data-bs-target="#dwellingModal"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-sm btn-danger"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>
    `).join('');
  }

  function renderPagination() {
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end   = Math.min(currentPage * itemsPerPage, data.length);

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