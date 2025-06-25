function initCountry() {
  const tabsData = [
  {
    columns: [
      { label: 'ID', field: 'id' },
      { label: 'Nombre', field: 'nombre' },
      { label: 'huellaCarbono', field: 'huellaCarbono' }
    ],
    data: [
        { "id": 1, "nombre": "Estados Unidos", "huellaCarbono": "15.2%" },
        { "id": 2, "nombre": "Canadá", "huellaCarbono": "14.6%" },
        { "id": 3, "nombre": "Australia", "huellaCarbono": "15.4%" },
        { "id": 4, "nombre": "Arabia Saudita", "huellaCarbono": "16.2%" },
        { "id": 5, "nombre": "Rusia", "huellaCarbono": "11.5%" },
        { "id": 6, "nombre": "Japón", "huellaCarbono": "8.7%" },
        { "id": 7, "nombre": "Alemania", "huellaCarbono": "8.9%" },
        { "id": 8, "nombre": "Corea del Sur", "huellaCarbono": "11.6%" },
        { "id": 9, "nombre": "Reino Unido", "huellaCarbono": "5.8%" },
        { "id": 10, "nombre": "Francia", "huellaCarbono": "4.6%" },
        { "id": 11, "nombre": "Italia", "huellaCarbono": "5.5%" },
        { "id": 12, "nombre": "España", "huellaCarbono": "5.1%" },
        { "id": 13, "nombre": "China", "huellaCarbono": "7.6%" },
        { "id": 14, "nombre": "India", "huellaCarbono": "1.9%" },
        { "id": 15, "nombre": "Brasil", "huellaCarbono": "2.3%" },
        { "id": 16, "nombre": "México", "huellaCarbono": "3.6%" },
        { "id": 17, "nombre": "Argentina", "huellaCarbono": "4.1%" },
        { "id": 18, "nombre": "Chile", "huellaCarbono": "4.5%" },
        { "id": 19, "nombre": "Colombia", "huellaCarbono": "2.2%" },
        { "id": 20, "nombre": "Sudáfrica", "huellaCarbono": "7.5%" },
        { "id": 21, "nombre": "Egipto", "huellaCarbono": "2.5%" },
        { "id": 22, "nombre": "Nigeria", "huellaCarbono": "0.7%" },
        { "id": 23, "nombre": "Indonesia", "huellaCarbono": "2.3%" },
        { "id": 24, "nombre": "Vietnam", "huellaCarbono": "1.9%" },
        { "id": 25, "nombre": "Filipinas", "huellaCarbono": "1.3%" },
        { "id": 26, "nombre": "Tailandia", "huellaCarbono": "3.8%" },
        { "id": 27, "nombre": "Perú", "huellaCarbono": "2.0%" },
        { "id": 28, "nombre": "Venezuela", "huellaCarbono": "4.2%" },
        { "id": 29, "nombre": "El Salvador", "huellaCarbono": "1.1%" },
        { "id": 30, "nombre": "Guatemala", "huellaCarbono": "1.0%" }
    ]
  }
];
    initCountryModal();
  renderTabs(tabsData);
}
function initCountryModal(){
  const modal = document.querySelector('#CountryModal');
  if(!modal) return;
  window.userModal = bootstrap.Modal.getOrCreateInstance(modal);
}
document.getElementById('CountryForm').addEventListener('submit', (e)=>{
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
          <button class="btn btn-sm btn-success me-1"><i class="bi bi-pencil-fill"></i></button>
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
