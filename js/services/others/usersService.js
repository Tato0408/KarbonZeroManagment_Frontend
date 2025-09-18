import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from "../../../utils/alerts.js";


export async function getAdmins(page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiUser/getAllAdmins?page=${page}&size=${size}`
    );
    if (!response.ok) {
      throw new Error(`Error cargando los administradores: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error cargando los administradores:", error);
    throw error;
  }
}

export async function getAdminById(id) {
  try {
    const response = await fetch(`${API_URL}/apiUser/getAdminById/${id}`);
    if (!response.ok) {
      throw new Error(`Error cargando el administrador: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error cargando el administrador:", error);
    throw error;
  }
}

export async function insertUser(payload) {
  try {
    const response = await fetch(`${API_URL}/apiUser/insertUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      Alerts.showToastCloseSuccess(
        `Error creando el usuario: ${response.status}`
      );
      return { ok: false, data: null };
    }

    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error creando el usuario: ${err}`);
    return { ok: false, data: null, error: err };
  }
}

export async function updateUser(id, payload) {
  try {
    const response = await fetch(`${API_URL}/apiUser/updateUser/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      Alerts.showToastCloseSuccess(
        `Error actualizando el usuario: ${response.status}`
      );
      return { ok: false, data: null };
    }

    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error actualizando el usuario: ${err}`);
    return { ok: false, data: null, error: err };
  }
}

export async function deleteUser(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar este usuario?",
    showDenyButton: true,
    confirmButtonText: "Eliminar",
    confirmButtonColor: "#DF4646",
    denyButtonColor: "#6d6c6c",
    denyButtonText: "Cancelar",
  });

  if (!result.isConfirmed) {
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/apiUser/deleteUser/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      Alerts.showToastCloseError(
        "No ha sido posible eliminar el usuario",
        res.status
      );
      return false;
    }
    Alerts.showToastCloseSuccess("Usuario eliminado exitosamente");
    return true;
  } catch (err) {
    Alerts.showToastCloseError("No ha sido posible eliminar el usuario", err);
  }
}
