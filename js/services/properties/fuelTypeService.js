import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from "../../../utils/alerts";

//Exportar la función para importar en el controllador
export async function getAllFuelType(page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiCar/getAllFuelType?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    //Evaluación de respuesta
    if (!response.ok) {
      throw new Error(
        `Error al cargar tipo de combustible: ${response.status}`
      );
    }
    //Retorno de respuesta en formato json
    return response.json();
  } catch (err) {
    console.error("Error cargando tipo de combustible", err);
    return err;
  }
}

export async function getMeasureUnits() {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    ///!Hacemos el get, nada nuevo
    const response = await fetch(
      `${API_URL}/apiMeasure/getAllMeasureUnitList`,
      { credentials: "include" }
    );
    ///Si esta malo pues aja, mandamos error
    if (!response.ok) {
      Alerts.showToastCloseError(
        `Error cargando categorias: ${response.status}`
      );
    }
    ///Retornamos la respuesta en formato json
    return response.json();
  } catch (error) {
    Alerts.showToastCloseError(`Error cargando categorias ${error}`);
    throw error;
  }
}

export async function getFuelTypeById(id) {
  try {
    const response = await fetch(`${API_URL}/apiCar/getFuelTypeById/${id}`, {
      credentials: "include",
    });
    //Se guarda la respuesta en una variable al ser solamente uno
    const res = await response.json();
    if (!response.ok) {
      throw new Error(
        `Error al cargar tipo de combustible: ${response.status}`
      );
    }
    return res;
  } catch (err) {
    console.error("Error cargando tipo de combustible", err);
    return err;
  }
}

export async function getFuelByName(searchName, page = 0, size = 10) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}/apiCar/getFuelTypeByName/${searchName}?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    ///Pues aca evaluamos si la respuesta fue buena y si no fue mandamos el error
    if (!response.ok) {
      console.error(`Error : ${response}`);
    }
    ///Finalmente retornamos nuestra respuesta en formato json
    return response.json();
    ///Ya el catch, supongo que ya se la saben ok
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
    throw error;
  }
}

export async function insertFuelType(playload) {
  try {
    const response = await fetch(`${API_URL}/apiCar/insertFuelType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playload),
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      Alerts.showToastCloseSuccess("tipo de combustible creado exitosamente");
      return { ok: true, data };
    } else {
      Alerts.showToastCloseError(
        `Error creando tipo de combustible: ${response.status}`
      );
      return { ok: false, data };
    }

  } catch (err) {
    Alerts.showToastCloseError(`Error creando tipo de combustible. ${err}`);
    //Retrono de false, data null y el respectivo error
    return { ok: false, data: null, error: err };
  }
}

export async function updateFuelType(playload, id) {
  try {
    const response = await fetch(
      `${API_URL}/apiCar/updateFuelType/${id.value}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playload),
        credentials: "include",
      }
    );
    const data = await response.json();
    if (response.ok) {
      Alerts.showToastCloseSuccess(
        "tipo de combustible actualizado exitosamente"
      );
    } else {
      Alerts.showToastCloseError(
        `Error actualizando tipo de combustible: ${response.status}`
      );
      console.log(response.status);
    }
    //Retorno un ok en true y la data
    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(
      `Error actualizando tipo de combustible. ${err}`
    );
    //Retrono de false, data null y el respectivo error
    return { ok: false, data: null, error: err };
    console.log(err);
  }
}

export async function deleteFuelType(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar este tipo de combustible?",
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
    const res = await fetch(`${API_URL}/apiCar/deleteFuelType/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      Alerts.showToastCloseError(
        "No ha sido posible eliminar el tipo de combustible",
        res.status
      );
      return false;
    }
    Alerts.showToastCloseSuccess("tipo de combustible eliminado exitosamente");
    return true;
  } catch (err) {
    Alerts.showToastCloseError(
      "No ha sido posible eliminar el tipo de combustible",
      err
    );
  }
}
