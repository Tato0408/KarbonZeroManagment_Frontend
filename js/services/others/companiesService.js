import { APIURL as API_URL } from "../../../utils/api_url";
import * as Alerts from "../../../utils/alerts";

export async function getApiKey(id) {
  try {
    const response = await fetch(`${API_URL}/apiCompany/getApiKey/${id}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Error cargando la compañia: ${response.status}`);
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.error("Error cargando la compañia:", error);
    return { ok: false, data: null };
  }
}

//Exportar la función para importar en el controllador
export async function getCompanies(page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiCompany/getAllCompany?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    if (!response.ok) {
      throw new Error(`Error cargando las compañias: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error cargando las compañias:", error);
    throw error;
  }
}

export async function getCompaniesById(id) {
  try {
    const response = await fetch(`${API_URL}/apiCompany/getCompanyById/${id}`, {
      credentials: "include",
    });
    const u = await response.json();
    if (!response.ok) {
      throw new Error(`Error cargando las compañias: ${response.status}`);
    }
    return u;
  } catch (error) {
    console.error("Error cargando las compañias:", error);
    throw error;
  }
}

export async function getAllCompaniesByName(
  searchName,
  currentPage = 0,
  currentSize = 10
) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}/apiCompany/getCompanyByName/${searchName}?page=${currentPage}&size=${currentSize}`,
      { credentials: "include" }
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      console.error("Error fetching companies");
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching companies: ${error}`);
    throw error;
  }
}

export async function insertCompany(payload) {
  try {
    const CResponse = await fetch(`${API_URL}/apiCompany/insertCompany`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const data = await CResponse.json();

    const ChResponse = await fetch(`${API_URL}/apiCompany/insertChannel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCompany: data.data.idCompany,
        name: payload.name,
      }),
      credentials: "include",
    });

    await ChResponse.json();

    if (CResponse.ok && ChResponse.ok) {
      Alerts.showToastCloseSuccess("Compañía y Canal creados exitosamente");
    } else {
      Alerts.showToastCloseError(
        `Error creando la compañia y canal: ${CResponse.status}, ${ChResponse.status}`
      );
      return { ok: false, data: null };
    }

    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error creando la compañia ${err}`);
    return { ok: false, data: null, error: err };
  }
}

export async function updateCompany(payload, id) {
  try {
    const response = await fetch(
      `${API_URL}/apiCompany/updateCompany/${id.value}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );
    const data = await response.json().catch(() => null);

    if (response.ok) {
      Alerts.showToastCloseSuccess("Compañia actualizado exitosamente");
    } else {
      Alerts.showToastCloseError(`Error actualizando la compañia`);
      return { ok: false, data: null };
    }
    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error actualizando la compañia ${err}`);
    return { ok: false, data: null, error: err };
  }
}

export async function deleteCompany(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar esta compañia?",
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
    const channel = await fetch(
      `${API_URL}/apiCompany/getChannelByCompany/${id}`,
      {
        credentials: "include",
      }
    );
    const channelRes = await channel.json();

    const resp = await fetch(
      `${API_URL}/apiCompany/deleteChannel/${channelRes.idChannel}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!resp.ok) {
      Alerts.showToastCloseError("No se pudo eliminar la compañia y canal");
      return false;
    }
    Alerts.showToastCloseSuccess("Compañia y canal eliminado exitosamente");
    return true;
  } catch (e) {
    Alerts.showToastCloseError("Error eliminando la compañia y canal");
    return false;
  }
}
