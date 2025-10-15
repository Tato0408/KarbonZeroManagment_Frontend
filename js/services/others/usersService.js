import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from "../../../utils/alerts.js";


export async function getAdmins(page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiUser/getAllUsersWithStatus/${1}?page=${page}&size=${size}`,
      { credentials: "include" }
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

export async function getUsers(page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiUser/getAllUsersWithStatus/${0}?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    if (!response.ok) {
      throw new Error(`Error cargando los usuarios: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error cargando los usuarios:", error);
    throw error;
  }
}

export async function getAdminsByName(name, page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiUser/getAdminsByName/${name}?page=${page}&size=${size}`,
      { credentials: "include" }
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

export async function getUsersByName(name, page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiUser/getUsersByName/${name}?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    if (!response.ok) {
      throw new Error(`Error cargando los usuarios: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error cargando los usuarios:", error);
    throw error;
  }
}

export async function getAdminById(id) {
  try {
    const response = await fetch(`${API_URL}/apiUser/getAdminById/${id}`, {
      credentials: "include",
    });
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
      credentials: "include",
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
      credentials: "include",
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
      credentials: "include",
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
export async function banUser(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de bloquear este usuario?",
    showDenyButton: true,
    confirmButtonText: "Bloquear",
    confirmButtonColor: "#DF4646",
    denyButtonColor: "#6d6c6c",
    denyButtonText: "Cancelar",
  });

  if (!result.isConfirmed) {
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/apiUser/updateDisabled/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({disabled: 1})
    });

    if (!res.ok) {
      Alerts.showToastCloseError(
        "No ha sido posible bloquear el usuario",
        res.status
      );
      return false;
    }
    Alerts.showToastCloseSuccess("Usuario bloqueado exitosamente");
    return true;
  } catch (err) {
    Alerts.showToastCloseError("No ha sido posible bloquear el usuario", err);
  }
}

export async function unbanUser(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de desbloquear este usuario?",
    showDenyButton: true,
    confirmButtonText: "Desbloquear",
    confirmButtonColor: "#DF4646",
    denyButtonColor: "#6d6c6c",
    denyButtonText: "Cancelar",
  });

  if (!result.isConfirmed) {
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/apiUser/updateDisabled/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({disabled: 0})
    });
    
    if (!res.ok) {
      Alerts.showToastCloseError(
        "No ha sido posible desbloquear el usuario",
        res.status
      );
      return false;
    }
    Alerts.showToastCloseSuccess("Usuario desbloqueado exitosamente");
    return true;
  } catch (err) {
    Alerts.showToastCloseError("No ha sido posible desbloquear el usuario", err);
  }
}

export async function putUserPassword(id, passwordUser) {

  const res = await fetch(`${API_URL}/apiUser/updateUserPassword/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify( passwordUser ),
  });
  return res;
}

export async function sendRecoveryEmail(email) {
  try {
    const res = await fetch(`${API_URL}/apiAuth/forgotPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return res;
  } catch (err) {
    Alerts.showToastCloseError("Error enviando correo de recuperación: ", err);
    throw err;
  }
}

export async function verifyRecoveryCode(code) {
  try {
    const response = await fetch(`${API_URL}/apiAuth/verifyCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({payload2}),
    });
    return response;
  } catch (err) {
    Alerts.showToastCloseError("Error verificando código: ", err);
    throw err;
  }
}  