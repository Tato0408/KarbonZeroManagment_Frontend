import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from '../../../utils/alerts.js'

export async function getTransport(page= 0, size=10) {
    try {
        const response = await fetch(`${API_URL}/apiTransport/getAllTransports?page=${page}&size=${size}`);
        if (!response.ok) {
            throw new Error(`Error cargando los transportes: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error cargando los transportes:", error);
        throw error;
    }
}

export async function getTransportById(id) {
    try {
        const response = await fetch(`${API_URL}/apiTransport/getTransportById/${id}`);
        const u = await response.json();
        if (!response.ok) {
            throw new Error(`Error cargando los transportes: ${response.status}`);
        }
        return u;
    } catch (error) {
        console.error("Error cargando los transportes:", error);
        throw error;
    }
}

export async function getAllTransportByName(
  searchName,
  currentPage = 0,
  currentSize = 10
) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}/apiTransport/getTransportByName/${searchName}?page=${currentPage}&size=${currentSize}`
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      console.error("Error fetching transport");
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching transport: ${error}`);
    throw error;
  }
}

export async function insertTransport(payload) {
    try {
        const response = await fetch(`${API_URL}/apiTransport/insertTransport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            Alerts.showToastCloseSuccess("Transporte creado exitosamente");
        } else {
            Alerts.showToastCloseError(`Error creando el transporte ${response.status}`);
        }
        return { ok: true, data };
    } catch (err) {
        Alerts.showToastCloseError(`Error creando el transporte ${err}`);
        return { ok: false, data: null, error: err };
    }
}

export async function updateTransport(payload, id) {
    try {
        const response = await fetch(`${API_URL}/apiTransport/updateTransport/${id.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => null);

        if (response.ok) {
            Alerts.showToastCloseSuccess("Transporte actualizado exitosamente");
        } else {
            Alerts.showToastCloseError(`Error actualizando el transporte`);
        }
        return { ok: true, data };
    } catch (err) {
        Alerts.showToastCloseError(`Error actualizando el transporte ${err}`);
        return { ok: false, data: null, error: err };
    }
}

export async function deleteTransport(id) {
    const result = await Swal.fire({
        title: "¿Estás seguro de eliminar este Transporte?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#DF4646",
        denyButtonColor: "#6d6c6c",
        denyButtonText: "Cancelar"
    });
    if (!result.isConfirmed) {
        return false;
    }
    try {
        const resp = await fetch(`${API_URL}/apiTransport/deleteTransport/${id}`, { method: 'DELETE' });
        if (!resp.ok) {
            Alerts.showToastCloseError("No se pudo eliminar el transporte");
            return false;
        }
        Alerts.showToastCloseSuccess("Transoorte eliminado exitosamente");
        return true;
    } catch (e) {
        Alerts.showToastCloseError("Error eliminando el transporte");
        return false;
    }
}