import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from "../../../utils/alerts.js";

// Obtener todas las unidades de medida
export async function getUnits(page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiMeasure/getAllMeasureUnit?page=${page}&size=${size}`
    );
    if (!response.ok) {
      Alerts.showToastCloseError(`Error cargando unidades: ${response.status}`);
      return { content: [], totalPages: 0, number: 0 };
    }
    const data = await response.json();
    return {
      content: Array.isArray(data.content) ? data.content : [],
      totalPages: data.totalPages || 1,
      number: data.number || 0,
    };
  } catch (err) {
    Alerts.showToastCloseError(`Error cargando unidades: ${err}`);
    return { content: [], totalPages: 0, number: 0 };
  }
}

///Exportamos la funcion para poder importarla en nuestra pagina
export async function getAllMeasureUnitList () {
    try {
        const response = await fetch(`${API_URL}/apiMeasure/getAllMeasureUnitList`);
        if (!response.ok) {
            console.error("Error fetching Unidades de medida");
        }
        return response.json();
    } catch (error) {
        console.error(`Error fetching unidades de medida ${error}`);
    }
}

// Obtener unidad por ID
export async function getUnitById(id) {
  try {
    const response = await fetch(
      `${API_URL}/apiMeasure/getMeasureUnitById/${id}`
    );
    if (!response.ok)
      throw new Error(`Error al cargar unidad: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Insertar nueva unidad
export async function insertUnit(payload) {
  try {
    const response = await fetch(
      `${API_URL}/apiMeasure/insertMeasureUnit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    if (response.ok)
      Alerts.showToastCloseSuccess("Unidad de medida creada exitosamente");
    else Alerts.showToastCloseError(`Error creando unidad: ${response.status}`);
    return { ok: response.ok, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error creando unidad: ${err}`);
    return { ok: false, data: null };
  }
}

export async function getUnitByName(searchName, page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiMeasure/getMeasureUnitByName/${encodeURIComponent(
        searchName
      )}?page=${page}&size=${size}`
    );
    if (!response.ok)
      throw new Error(`Error al buscar unidades: ${response.status}`);
    const data = await response.json();
    return {
      content: Array.isArray(data.content) ? data.content : [],
      number: data.number ?? 0,
      totalPages: data.totalPages ?? 1,
    };
  } catch (error) {
    console.error(`Error buscando unidades:`, error);
    return { content: [], number: 0, totalPages: 0 };
  }
}

// Actualizar unidad
export async function updateUnit(payload, id) {
  try {
    const response = await fetch(
      `${API_URL}/apiMeasure/updateMeasureUnit/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    if (response.ok)
      Alerts.showToastCloseSuccess("Unidad actualizada exitosamente");
    else
      Alerts.showToastCloseError(
        `Error actualizando unidad: ${response.status}`
      );
    return { ok: response.ok, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error actualizando unidad: ${err}`);
    return { ok: false, data: null };
  }
}

// Eliminar unidad
export async function deleteUnit(id) {
  if (!id) {
    Alerts.showToastCloseError("ID inválido para eliminar unidad");
    return false;
  }

  try {
    const result = await Swal.fire({
      title: "¿Estás seguro de eliminar esta unidad?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#DF4646",
      denyButtonColor: "#6d6c6c",
      denyButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return false;

    const response = await fetch(
      `${API_URL}/apiMeasure/deleteMeasureUnit/${id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      const text = await response.text(); // captura error real del backend
      Alerts.showToastCloseError(
        `No se pudo eliminar la unidad: ${response.status} - ${text}`
      );
      return false;
    }

    Alerts.showToastCloseSuccess("Unidad eliminada exitosamente");
    return true;
  } catch (err) {
    Alerts.showToastCloseError(`Error eliminando unidad: ${err}`);
    return false;
  }
}
