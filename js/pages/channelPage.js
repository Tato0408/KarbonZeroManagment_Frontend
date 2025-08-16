export async function render() {
    return `
<div class="container py-4" id="canal-chat" style="display: flex; flex-direction: column; height: 100vh;">
    <div style="display: flex; flex: 1; overflow: hidden;">
        <div style="width: 25%; min-width: 200px; border-right: 1px solid #ccc; padding: 1rem; overflow-y: auto;">
            <div style="margin-bottom: 1rem; position: relative;">
                <input type="text" placeholder="Buscar"
                    style="width: 100%; padding: 10px 15px 10px 35px; border-radius: 20px; border: 1px solid #ccc;" />
                <iconify-icon icon="mdi:magnify"
                    style="position: absolute; top: 50%; left: 12px; transform: translateY(-50%); font-size: 16px; color: #888;"></iconify-icon>
            </div>
            <div id="chat-list"></div>
        </div>
        <div style="width: 50%; min-width: 300px; display: flex; flex-direction: column; padding: 1rem;">
            <div
                style="display: flex; align-items: center; gap: 0.6rem; font-weight: bold; font-size: 1.2rem; color: #007C65; margin-bottom: 1rem;">
                <img src="img/logorical.png"
                    style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
                Ricaldone
            </div>

            <div id="chat-content"
                style="flex: 1 1 auto; display: flex; flex-direction: column; gap: 1rem; background: #eeeeee; padding: 1rem; border-radius: 10px; overflow-y: auto;">
            </div>

            <div style="display: flex; align-items: center; margin-top: 1rem;">
                <input type="text" placeholder="Escribe un mensaje"
                    style="flex: 1; padding: 0.6rem 1rem; border-radius: 30px; border: 1px solid #ccc;" />
                <button
                    style="margin-left: 0.5rem; background-color: #007C65; color: white; border: none; border-radius: 12%; width: 42px; height: 42px; font-size: 1.2rem;">➤</button>
            </div>
        </div>
        <div
            style="width: 25%; min-width: 200px; padding: 1rem; display: flex; flex-direction: column; overflow-y: auto;">
            <div style="text-align: center; margin-bottom: 1rem;">
                <img src="img/logorical.png" style="width: 110px; height: auto;" alt="Logo" />
            </div>

            <div style="text-align: center; font-weight: bold; color: #007C65; margin-bottom: 0.8rem;">
                Información general
            </div>

            <div style="font-size: 0.95rem; line-height: 1.5; color: #007C65; margin-bottom: 1rem;">
                <p><strong>Institución:</strong><br>Instituto Técnico Ricaldone</p>
                <p><strong>Nombre:</strong><br>Juan Pablo López</p>
                <p><strong>Correo Electrónico:</strong><br>juanp123@gmail.com</p>
            </div>

            <div style="flex-grow: 1; display: flex; flex-direction: column;">
                <div class="dropdown-section"
                    style="border-top: 1px solid #ccc; cursor: default; padding: 0.6rem 0; user-select: none;">
                    <div class="dropdown-title"
                        style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #007C65; font-weight: bold;">Información adicional</span>
                        <iconify-icon class="arrow" icon="mdi:play"
                            style="color: #007C65; font-size: 24px; cursor: pointer; transition: transform 0.3s ease;"></iconify-icon>
                    </div>
                    <div class="dropdown-content"
                        style="display: none; color: gray; font-size: 0.95rem; margin-top: 0.6rem; padding-left: 0.5rem;">
                        Aún no se encuentra nada.
                    </div>
                </div>

                <div class="dropdown-section"
                    style="border-top: 1px solid #ccc; cursor: default; padding: 0.6rem 0; user-select: none;">
                    <div class="dropdown-title"
                        style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #007C65; font-weight: bold;">Archivos compartidos</span>
                        <iconify-icon class="arrow" icon="mdi:play"
                            style="color: #007C65; font-size: 24px; cursor: pointer; transition: transform 0.3s ease;"></iconify-icon>
                    </div>
                    <div class="dropdown-content"
                        style="display: none; color: gray; font-size: 0.95rem; margin-top: 0.6rem; padding-left: 0.5rem;">
                        Aún no se encuentra nada.
                    </div>
                </div>

                <div class="dropdown-section"
                    style="border-top: 1px solid #ccc; cursor: default; padding: 0.6rem 0; user-select: none;">
                    <div class="dropdown-title"
                        style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #007C65; font-weight: bold;">Links compartidos</span>
                        <iconify-icon class="arrow" icon="mdi:play"
                            style="color: #007C65; font-size: 24px; cursor: pointer; transition: transform 0.3s ease;"></iconify-icon>
                    </div>
                    <div class="dropdown-content"
                        style="display: none; color: gray; font-size: 0.95rem; margin-top: 0.6rem; padding-left: 0.5rem;">
                        Aún no se encuentra nada.
                    </div>
                </div>
                
                <div class="dropdown-section"
                    style="border-top: 1px solid #ccc; cursor: default; padding: 0.6rem 0; user-select: none;">
                    <div class="dropdown-title"
                        style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #007C65; font-weight: bold;">Documentos compartidos</span>
                        <iconify-icon class="arrow" icon="mdi:play"
                            style="color: #007C65; font-size: 24px; cursor: pointer; transition: transform 0.3s ease;"></iconify-icon>
                    </div>
                    <div class="dropdown-content"
                        style="display: none; color: gray; font-size: 0.95rem; margin-top: 0.6rem; padding-left: 0.5rem;">
                        Aún no se encuentra nada.
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  `;
}
export function afterRender() {
    initChannel();
}
function initChannel() {
  const mensajes = [
    {
      nombre: "Abel Joyar",
      hora: "11:09",
      titulo: "Tips de reducción",
      contenido: "Los centros de datos ya consumen más del 2% de la electricidad global."
    },
    {
      nombre: "Joshua Marinero",
      hora: "11:20",
      titulo: "Reporte mensual",
      contenido: "Revisen el documento compartido en el canal principal."
    },
    {
      nombre: "Gerardo Jovel",
      hora: "11:50",
      titulo: "Recordatorio reunión",
      contenido: "No olviden la reunión el mañana a las 11 en punto."
    },
    {
      nombre: "Freddy Pérez",
      hora: "12:10",
      titulo: "Consumo energético",
      contenido: "Desconectar cargadores y equipos no utilizados ahorra energía y reduce emisiones innecesarias."
    },
    {
      nombre: "Edwin Alfaro",
      hora: "12:45",
      titulo: "Agua y carbono",
      contenido: "Calentar agua requiere energía. Usa solo la necesaria y reduce tu impacto ambiental."
    },
    {
      nombre: "Camila Quinteros",
      hora: "03:00",
      titulo: "Reforestación",
      contenido: "Plantar árboles es una de las acciones más efectivas para capturar CO₂ del ambiente."
    }
  ];

  const publicaciones = [
    {
      fecha: "20 de marzo",
      texto: "Exposición día del agua 20-03-2025",
      imagen: "img/tierrachat.avif"
    },
    {
      fecha: "22 de marzo",
      texto: "¡Feliz día del agua!",
      imagen: "img/aguachat.webp"
    }
  ];

  const chatList = document.getElementById("chat-list");
    chatList.innerHTML = "";
  mensajes.forEach(m => {
    chatList.innerHTML += `
        <div style="padding-bottom: 0.8rem; margin-bottom: 0.8rem; border-bottom: 1px solid #ddd;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #007C65; color: white; font-size: 0.8rem; display: flex; justify-content: center; align-items: center;">${m.nombre.split(" ").map(p => p[0]).join("")}</div>
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #007C65; font-weight: bold;">${m.nombre}</span>
                <span style="font-size: 0.75rem; color: gray;">${m.hora}</span>
              </div>
              <div style="font-weight: bold; font-size: 0.9rem;">${m.titulo}</div>
              <div style="font-size: 0.85rem; color: #444;">${m.contenido}</div>
            </div>
          </div>
         <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 6px;">
            <iconify-icon icon="mdi:checkbox-outline" class="check-icon" style="color: green; font-size: 16px; cursor: pointer;"></iconify-icon>
            <iconify-icon icon="mdi:close-box-outline" class="close-icon" style="color: red; font-size: 16px; cursor: pointer;"></iconify-icon>
        </div>
        </div>
      `;
  });

  const chatContent = document.getElementById("chat-content");
  chatContent.innerHTML = "";
  publicaciones.forEach(p => {
    chatContent.innerHTML += `
    <div style="background: white; padding: 10px; border-radius: 10px; max-width: 75%; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="font-size: 0.75rem; color: #777; margin-bottom: 4px;">${p.fecha}</div>
      <img src="${p.imagen}" alt="Publicación"
        style="width: 100%; height: 140px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />
      <div style="font-size: 0.9rem; color: #333;">${p.texto}</div>
    </div>
  `;
  });

  document.querySelectorAll('.dropdown-section').forEach(section => {
    const title = section.querySelector('.dropdown-title');
    const content = section.querySelector('.dropdown-content');
    const arrow = section.querySelector('.arrow');

    title.addEventListener('click', () => {
      const isOpen = content.style.display === 'block';

      // Cierra todos
      document.querySelectorAll('.dropdown-content').forEach(c => c.style.display = 'none');
      document.querySelectorAll('.arrow').forEach(a => a.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.style.display = 'block';
        arrow.style.transform = 'rotate(90deg)';
      }
    });

    setTimeout(() => {
      document.querySelectorAll('.check-icon').forEach(el => {
        el.addEventListener('mouseover', () => el.style.transform = 'scale(1.2)');
        el.addEventListener('mouseout', () => el.style.transform = 'scale(1)');
        el.addEventListener('click', () => {
          el.style.color = '#005d3c';
          el.style.transform = 'scale(1.4)';
          setTimeout(() => el.style.transform = 'scale(1)', 150);
        });
      });

      document.querySelectorAll('.close-icon').forEach(el => {
        el.addEventListener('mouseover', () => el.style.transform = 'scale(1.2)');
        el.addEventListener('mouseout', () => el.style.transform = 'scale(1)');
        el.addEventListener('click', () => {
          el.style.color = '#7c0000';
          el.style.transform = 'scale(1.4)';
          setTimeout(() => el.style.transform = 'scale(1)', 150);
        });
      });
    }, 100);
  });
  const styleResponsive = document.createElement('style');
  styleResponsive.innerHTML = `
  @media (max-width: 768px) {
    #canal-chat > div {
      flex-direction: row;
      overflow: hidden;
    }

    #canal-chat > div > div:first-child, /* Panel izquierdo */
    #canal-chat > div > div:last-child {  /* Panel derecho */
      display: none !important;
    }

    #canal-chat > div > div:nth-child(2) {
      width: 100% !important;
      min-width: unset !important;
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }

    #chat-content {
      flex: 1 1 auto;
      overflow-y: auto;
    }
  }
`;
  document.head.appendChild(styleResponsive);
}
