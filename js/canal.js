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
document.addEventListener("DOMContentLoaded", initChannel);
