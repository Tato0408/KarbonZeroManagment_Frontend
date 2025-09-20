import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from "../../../utils/alerts.js";

// Obtener medidas
export async function getMeasure(page = 0, size = 10) {
  try {
    const res = await fetch(
      `${API_URL}/apiMeasure/getAllMeasures?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    if (!res.ok) throw new Error(`Error cargando medidas: ${res.status}`);
    const data = await res.json();
    return {
      content: Array.isArray(data.content) ? data.content : [],
      number: data.number ?? 0,
      totalPages: data.totalPages ?? 1,
    };
  } catch (err) {
    console.error(err);
    return { content: [], number: 0, totalPages: 1 };
  }
}

// Obtener medida por id
export async function getMeasureById(id) {
  try {
    const res = await fetch(`${API_URL}/apiMeasure/getMeasureById/${id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Error cargando medida: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getMeasureByName(searchName, page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiMeasure/getMeasureByName/${encodeURIComponent(
        searchName
      )}?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    if (!response.ok)
      throw new Error(`Error al buscar medidas: ${response.status}`);
    const data = await response.json();
    return {
      content: Array.isArray(data.content) ? data.content : [],
      number: data.number ?? 0,
      totalPages: data.totalPages ?? 1,
    };
  } catch (error) {
    console.error(`Error buscando medidas:`, error);
    return { content: [], number: 0, totalPages: 0 };
  }
}

// Insertar medida
export async function insertMeasure(payload) {
  try {
    const res = await fetch(`${API_URL}/apiMeasure/insertMeasure`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const data = await res.json();
    res.ok
      ? Alerts.showToastCloseSuccess("Medida creada exitosamente")
      : Alerts.showToastCloseError(`Error creando medida: ${res.status}`);
    return { ok: res.ok, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error creando medida: ${err}`);
    return { ok: false, data: null, error: err };
  }
}

// Actualizar medida
export async function updateMeasure(id, payload) {
  try {
    const res = await fetch(`${API_URL}/apiMeasure/updateMeasure/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const data = await res.json();
    res.ok
      ? Alerts.showToastCloseSuccess("Medida actualizada exitosamente")
      : Alerts.showToastCloseError(`Error actualizando medida: ${res.status}`);
    return { ok: res.ok, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error actualizando medida: ${err}`);
    return { ok: false, data: null, error: err };
  }
}

// Eliminar medida
// Eliminar medida
export async function deleteMeasure(id) {
  if (!id) {
    Alerts.showToastCloseError("ID inválido para eliminar medida");
    return false;
  }

  try {
    const result = await Swal.fire({
      title: "¿Estás seguro de eliminar esta medida?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: "Cancelar",
      confirmButtonColor: "#DF4646",
      denyButtonColor: "#6d6c6c",
    });
    if (!result.isConfirmed) return false;

    const res = await fetch(`${API_URL}/apiMeasure/deleteMeasure/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const text = await res.text(); // capturar mensaje de error del backend
      Alerts.showToastCloseError(
        `No fue posible eliminar la medida: ${res.status} - ${text}`
      );
      return false;
    }
    Alerts.showToastCloseSuccess("Medida eliminada exitosamente");
    return true;
  } catch (err) {
    Alerts.showToastCloseError(`Error eliminando medida: ${err}`);
    return false;
  }
}
