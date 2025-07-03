;(function(){
  const modalMap = {
    tamanocarro: 'CarModal',
    tipoCombustible: 'FuelModal'
  };

  const tabList    = document.getElementById('tabList');
  const tabContent = document.getElementById('tabContent');
  const kzButton   = document.getElementById('button-kz');

  function initVehicle() {
    kzButton.setAttribute('type', 'button');
    kzButton.setAttribute('data-bs-toggle', 'modal');
    kzButton.setAttribute('data-bs-target', '#CarModal');

    const tabsData = [
      {
        id: 'tamanocarro',
        name: 'tamanocarro',
        columns: [
          { label: 'ID', field: 'id' },
          { label: 'Tamano', field: 'tamano' }
        ],
        data: [
            { "id": 1, "tamano": "Carro pequeño" },
            { "id": 2, "tamano": "Carro mediano" },
            { "id": 3, "tamano": "Carro grande" },
            { "id": 4, "tamano": "SUV" },
            { "id": 5, "tamano": "Pickup" },
            { "id": 6, "tamano": "Furgoneta" }
        ]
      },
      {
        id: 'tipoCombustible',
        name: 'tipoCombustible',
        columns: [
          { label: 'ID', field: 'id' },
          { label: 'Nombre', field: 'nombre' },
          { label: 'Unidad', field: 'unidad' },
          { label: 'HuellaCarbono', field: 'huellaCarbono' }
        ],
        data: [
            { "id": 1, "nombre": "Gasolina", "unidad": "litro", "huellaCarbono": "2.31 tCO₂e" },
            { "id": 2, "nombre": "Diésel", "unidad": "litro", "huellaCarbono": "2.68 tCO₂e" },
            { "id": 3, "nombre": "Gas natural", "unidad": "m³", "huellaCarbono": "2.01 tCO₂e" },
            { "id": 4, "nombre": "Electricidad (red promedio)", "unidad": "kWh", "huellaCarbono": "0.4 tCO₂e" },
            { "id": 5, "nombre": "Electricidad (100% renovable)", "unidad": "kWh", "huellaCarbono": "0.05 tCO₂e" },
            { "id": 6, "nombre": "GLP (gas licuado)", "unidad": "litro", "huellaCarbono": "1.51 tCO₂e" },
            { "id": 7, "nombre": "Etanol", "unidad": "litro", "huellaCarbono": "1.52 tCO₂e" },
            { "id": 8, "nombre": "Biodiésel", "unidad": "litro", "huellaCarbono": "0.8 tCO₂e" }
        ]
      }
    ];

    renderTabs(tabsData);
  }

  function renderTabs(tabsData) {
    tabList.innerHTML    = '';
    tabContent.innerHTML = '';

    tabsData.forEach((tab, idx) => {
      const tabItem = document.createElement('li');
      tabItem.className = 'nav-item';
      tabItem.innerHTML = `
        <a class="nav-link ${idx===0?'active':''}"
           data-bs-toggle="tab"
           href="#${tab.id}">
           ${tab.name}
        </a>`;
      tabList.appendChild(tabItem);

      const tabPane = document.createElement('div');
      tabPane.className = `tab-pane fade${idx===0?' show active':''}`;
      tabPane.id = tab.id;
      tabPane.innerHTML = `
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                ${tab.columns.map(c=>`<th>${c.label}</th>`).join('')}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="mt-2">
          <nav class="d-flex justify-content-center">
            <ul class="pagination mb-0"></ul>
          </nav>
        </div>`;
      tabContent.appendChild(tabPane);

      setupPagination(tabPane, tab.data, tab.columns, tab.id);
    });

    kzButton.innerHTML = `<i class="bi bi-plus-circle-fill me-1"></i>Agregar ${tabsData[0].name}`;

    // Listener para cambiar pestaña y actualizar botón/modal
    tabList.querySelectorAll('a.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        const active = tabsData.find(t=>`#${t.id}`===href);

        // marcar activa
        tabList.querySelectorAll('a.nav-link').forEach(l=>l.classList.remove('active'));
        link.classList.add('active');

        if (active) {
          kzButton.innerHTML = `<i class="bi bi-plus-circle-fill me-1"></i>Agregar ${active.name}`;
          kzButton.setAttribute('data-bs-target', `#${modalMap[active.id]}`);
        }
      });
    });
  }

  function setupPagination(tabPane, data, columns, name) {
    const tbody      = tabPane.querySelector('tbody');
    const pagination = tabPane.querySelector('.pagination');
    let currentPage  = 1;
    const perPage    = 10;

    function renderPage(page) {
      currentPage = page;
      const start  = (page-1)*perPage;
      const slice  = data.slice(start, start+perPage);

      tbody.innerHTML = slice.map(item=>`
        <tr>
          ${columns.map(c=>`<td>${item[c.field]||''}</td>`).join('')}
          <td>
            <button class="btn btn-sm btn-success me-1"
                    data-bs-toggle="modal"
                    data-bs-target="#${modalMap[name]}">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button class="btn btn-sm btn-danger"><i class="bi bi-trash-fill"></i></button>
          </td>
        </tr>`).join('');
    }

    function renderPagination() {
      const totalPages = Math.ceil(data.length/perPage) || 1;
      const info       = `<div class="text-muted">Mostrando ${(currentPage-1)*perPage+1}-${Math.min(currentPage*perPage,data.length)} de ${data.length}</div>`;
      const ul         = document.createElement('ul');
      ul.className     = 'pagination mb-0';

      function addBtn(label, page, disabled, active) {
        const li = document.createElement('li');
        li.className = `page-item${disabled?' disabled':''}${active?' active':''}`;
        li.innerHTML = `<button class="page-link" ${disabled?'tabindex="-1"':''}>${label}</button>`;
        if (!disabled && !active) li.firstChild.addEventListener('click', ()=>{ renderPage(page); renderPagination(); });
        ul.appendChild(li);
      }

      pagination.innerHTML = '';
      addBtn('«', currentPage-1, currentPage===1);
      for (let p=1; p<=totalPages; p++) addBtn(p, p, false, p===currentPage);
      addBtn('»', currentPage+1, currentPage===totalPages);

      pagination.insertAdjacentHTML('afterbegin', info);
      pagination.appendChild(ul);
    }

    renderPage(currentPage);
    renderPagination();
  }

  window.initVehicle = initVehicle;
})();
