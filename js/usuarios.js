function initUsers() {
  const tabsData = [
  {
    id: 'usuarios',
    name: 'Usuarios',
    columns: [
      { label: 'ID Usuario', field: 'idUsuario' },
      { label: 'Compañía', field: 'compania' },
      { label: 'Usuario', field: 'usuario' },
      { label: 'Nombre', field: 'nombre' },
      { label: 'Apellido', field: 'apellido' },
      { label: 'Correo', field: 'correo' },
      { label: 'País', field: 'pais' }
    ],
    data: [
      {
        idUsuario: 1,
        compania: 'Microsoft',
        usuario: 'jdoe1',
        nombre: 'John',
        apellido: 'Doe',
        correo: 'jdoe1@microsoft.com',
        pais: 'Estados Unidos'
      },
      {
        idUsuario: 2,
        compania: 'Apple',
        usuario: 'asmith2',
        nombre: 'Alice',
        apellido: 'Smith',
        correo: 'asmith2@apple.com',
        pais: 'Canadá'
      },
      {
        idUsuario: 3,
        compania: 'Amazon',
        usuario: 'bjohnson3',
        nombre: 'Bob',
        apellido: 'Johnson',
        correo: 'bjohnson3@amazon.com',
        pais: 'Reino Unido'
      },
      {
        idUsuario: 4,
        compania: 'Google',
        usuario: 'clopez4',
        nombre: 'Carlos',
        apellido: 'López',
        correo: 'clopez4@google.com',
        pais: 'México'
      },
      {
        idUsuario: 5,
        compania: 'Tesla',
        usuario: 'dgarcia5',
        nombre: 'Daniela',
        apellido: 'García',
        correo: 'dgarcia5@tesla.com',
        pais: 'España'
      },
      {
        idUsuario: 6,
        compania: 'IBM',
        usuario: 'emartinez6',
        nombre: 'Elena',
        apellido: 'Martínez',
        correo: 'emartinez6@ibm.com',
        pais: 'Argentina'
      },
      {
        idUsuario: 7,
        compania: 'Intel',
        usuario: 'fhernandez7',
        nombre: 'Francisco',
        apellido: 'Hernández',
        correo: 'fhernandez7@intel.com',
        pais: 'Chile'
      },
      {
        idUsuario: 8,
        compania: 'Samsung',
        usuario: 'gcastro8',
        nombre: 'Gabriela',
        apellido: 'Castro',
        correo: 'gcastro8@samsung.com',
        pais: 'Corea del Sur'
      },
      {
        idUsuario: 9,
        compania: 'Sony',
        usuario: 'hrodriguez9',
        nombre: 'Héctor',
        apellido: 'Rodríguez',
        correo: 'hrodriguez9@sony.com',
        pais: 'Japón'
      },
      {
        idUsuario: 10,
        compania: 'Nokia',
        usuario: 'isanchez10',
        nombre: 'Isabel',
        apellido: 'Sánchez',
        correo: 'isanchez10@nokia.com',
        pais: 'Finlandia'
      }
    ]
  }
];
  initUserModal();
  renderTabs(tabsData);
}

function initUserModal(){
  const modal = document.querySelector('#usersModal');
  if(!modal) return;
  window.userModal = bootstrap.Modal.getOrCreateInstance(modal);
}

document.getElementById('userForm').addEventListener('submit', (e)=>{
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
      <a class="nav-link ${idx === 0 ? 'active' : ''}" data-bs-toggle="tab" href="#${tab.id}">
        ${tab.name}
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