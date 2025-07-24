function initCompani() {
  const tabsData = [
  {
    columns: [
      { label: 'ID', field: 'id' },
      { label: 'Nombre', field: 'nombre' },
      { label: 'Dominio', field: 'dominio' }
    ],
    data: [
      { id: 1, nombre: 'Google', dominio: 'google.com' },
      { id: 2, nombre: 'Apple', dominio: 'apple.com' },
      { id: 3, nombre: 'Microsoft', dominio: 'microsoft.com' },
      { id: 4, nombre: 'Amazon', dominio: 'amazon.com' },
      { id: 5, nombre: 'IBM', dominio: 'ibm.com' },
      { id: 6, nombre: 'Intel', dominio: 'intel.com' },
      { id: 7, nombre: 'NVIDIA', dominio: 'nvidia.com' },
      { id: 8, nombre: 'Adobe', dominio: 'adobe.com' },
      { id: 9, nombre: 'Salesforce', dominio: 'salesforce.com' },
      { id: 10, nombre: 'Oracle', dominio: 'oracle.com' },
      { id: 11, nombre: 'Samsung', dominio: 'samsung.com' },
      { id: 12, nombre: 'Facebook', dominio: 'facebook.com' },
      { id: 13, nombre: 'Tesla', dominio: 'tesla.com' },
      { id: 14, nombre: 'Spotify', dominio: 'spotify.com' },
      { id: 15, nombre: 'Netflix', dominio: 'netflix.com' },
      { id: 16, nombre: 'Zoom', dominio: 'zoom.us' },
      { id: 17, nombre: 'Twitter', dominio: 'twitter.com' },
      { id: 18, nombre: 'LinkedIn', dominio: 'linkedin.com' },
      { id: 19, nombre: 'Slack', dominio: 'slack.com' },
      { id: 20, nombre: 'Dropbox', dominio: 'dropbox.com' },
      { id: 21, nombre: 'Asana', dominio: 'asana.com' },
      { id: 22, nombre: 'Atlassian', dominio: 'atlassian.com' },
      { id: 23, nombre: 'Shopify', dominio: 'shopify.com' },
      { id: 24, nombre: 'GitHub', dominio: 'github.com' },
      { id: 25, nombre: 'Bitbucket', dominio: 'bitbucket.org' },
      { id: 26, nombre: 'PayPal', dominio: 'paypal.com' },
      { id: 27, nombre: 'eBay', dominio: 'ebay.com' },
      { id: 28, nombre: 'Alibaba', dominio: 'alibaba.com' },
      { id: 29, nombre: 'Tencent', dominio: 'tencent.com' },
      { id: 30, nombre: 'Baidu', dominio: 'baidu.com' }
    ]
  }
];
    initCopaniModal();
  renderTabs(tabsData);
}
function initCopaniModal(){
  const modal = document.querySelector('#CompaniModal');
  if(!modal) return;
  window.userModal = bootstrap.Modal.getOrCreateInstance(modal);
}
document.getElementById('CompaniForm').addEventListener('submit', (e)=>{
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
      <a class="nav-link ${idx === 0 ? 'active' : ''}" data-bs-toggle="tab" href="#${tab.id}">Compañia
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
        ${columns.map(c => `<td class="accion">${r[c.field] ?? ''}</td>`).join('')}
        <td class="accion">
          <button class="btn btn-sm btn-success me-1" data-bs-toggle="modal" data-bs-target="#CompaniModal"><i class="bi bi-pencil-fill"></i></button>
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
