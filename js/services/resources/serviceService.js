import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from '../../../utils/alerts.js'

///Exporamos la funcion para poder importarla en nuestro controlador
export async function getService(page= 0, size=10) {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        const response = await fetch(`${API_URL}/apiService/getMeasureUnitService?page=${page}&size=${size}`);
        ///Pues aca evaluamos si la respuesta fue buena y si no fue mandamos el error
        if (!response.ok) {
            throw new Error(`Error cargando los servicios: ${response.status}`);
        }
        ///Finalmente retornamos nuestra respuesta en formato json
        return response.json();
        ///Ya el catch, supongo que ya se la saben ok
    } catch (error) {
        console.error("Error cargando los servicios:", error);
        throw error;
    }
}
export async function getServiceById(id) {
    try {
        const response = await fetch(`${API_URL}/apiService/getMeasureUnitServiceById/${id}`);
        const u = await response.json();
        if (!response.ok) {
            throw new Error(`Error cargando los servicios: ${response.status}`);
        }
        return u;
    } catch (error) {
        console.error("Error cargando los servicios:", error);
        throw error;
    }
}
export async function getAllMeasureUnitServiceByName(
  searchName,
  currentPage = 0,
  currentSize = 10
) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}/apiService/getMeasureUnitServiceByName/${searchName}?page=${currentPage}&size=${currentSize}`
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      console.error("Error fetching services");
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    console.error(`Error fetching services: ${error}`);
    throw error;
  }
}
export async function insertService(payload) {
    try {
        const response = await fetch(`${API_URL}/apiService/insertMeasureUnitService`,  {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            Alerts.showToastCloseSuccess("Servicio creado exitosamente");
        } else {
            Alerts.showToastCloseError(`Error creando el Servicio ${response.status}`);
        }
        return { ok: true, data };
    } catch (err) {
        Alerts.showToastCloseError(`Error creando el Servicio ${err}`);
        return { ok: false, data: null, error: err };
    }
}
export async function updateService(payload, id) {
    try {
        const response = await fetch(`${API_URL}/apiService/updateMeasureUnitService/${id.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => null);

        if (response.ok) {
            Alerts.showToastCloseSuccess("Servicio actualizado exitosamente");
        } else {
            Alerts.showToastCloseError(`Error actualizando el servicio`);
        }
        return { ok: true, data };
    } catch (err) {
        Alerts.showToastCloseError(`Error actualizando el servicio ${err}`);
        return { ok: false, data: null, error: err };
    }
}
export async function deleteService(id) {
    const result = await Swal.fire({
        title: "¿Estás seguro de eliminar este Servicio?",
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
        const resp = await fetch(`${API_URL}/apiService/deleteMeasureUnitService/${id}`, { method: 'DELETE' });
        if (!resp.ok) {
            Alerts.showToastCloseError("No se pudo eliminar el servicio");
            return false;
        }
        Alerts.showToastCloseSuccess("Servicio eliminado exitosamente");
        return true;
    } catch (e) {
        Alerts.showToastCloseError("Error eliminando el servicio");
        return false;
    }
}

///Exportamos la funcion para poder importarla en nuestra pagina
export async function getAllServicesList () {
    try {
        const response = await fetch(`${API_URL}/apiService/getAllServiceList`);
        if (!response.ok) {
            console.error("Error fetching Servicios");
        }
        return response.json();
    } catch (error) {
        console.error(`Error fetching Servicios ${error}`);
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