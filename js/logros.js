function initAchievements() {
  const tabsData = [
  {
    columns: [
      { label: 'ID', field: 'id' },
      { label: 'Nombre', field: 'nombre' }
    ],
    data: [
        { "id": 1, "nombre": "¡Has creado tu primer consumo!" },
        { "id": 2, "nombre": "Has registrado tu primer medio de transporte." },
        { "id": 3, "nombre": "¡Has reducido tu huella de carbono por primera vez!" },
        { "id": 4, "nombre": "Completaste una semana registrando tus actividades." },
        { "id": 5, "nombre": "Has evitado emisiones usando transporte ecológico." },
        { "id": 6, "nombre": "Has reducido tu consumo energético en casa." },
        { "id": 7, "nombre": "¡Lograste una reducción del 10% en tu huella total!" },
        { "id": 8, "nombre": "Has compartido tu progreso con otros usuarios." },
        { "id": 9, "nombre": "¡Eres constante! Llevas un mes usando la app." },
        { "id": 10, "nombre": "Has compensado emisiones plantando un árbol o equivalente." },
        { "id": 11, "nombre": "Has evitado el uso del automóvil durante una semana." },
        { "id": 12, "nombre": "Tu huella de carbono es más baja que el promedio de tu país." },
        { "id": 13, "nombre": "Participaste en un reto ecológico comunitario." },
        { "id": 14, "nombre": "Has influido a otra persona a unirse a la app." },
        { "id": 15, "nombre": "Has alcanzado una huella semanal por debajo de 5 kg de CO₂." }
    ]

  }
];
    initAchievementsModal();
  renderTabs(tabsData);
}
function initAchievementsModal(){
  const modal = document.querySelector('#AchievementsModal');
  if(!modal) return;
  window.userModal = bootstrap.Modal.getOrCreateInstance(modal);
}
document.getElementById('AchievementsForm').addEventListener('submit', (e)=>{
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
      <a class="nav-link ${idx === 0 ? 'active' : ''}" data-bs-toggle="tab" href="#${tab.id}">Logros
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
          <button class="btn btn-sm btn-success me-1" data-bs-toggle="modal" data-bs-target="#AchievementsModal"><i class="bi bi-pencil-fill"></i></button>
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