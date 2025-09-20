import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from "../../../utils/alerts";

//Exportar la función para importar en el controllador
export async function getLivingSpaceTypes(page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiLivingSpace/getAllLivingSpaceTypes?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    //Evaluación de respuesta
    if (!response.ok) {
      throw new Error(`Error al cargar viviendas: ${response.status}`);
    }
    //Retorno de respuesta en formato json
    return response.json();
  } catch (err) {
    console.error("Error cargando viviendas", err);
    return err;
  }
}

export async function getLivingSpaceTypeById(id) {
  try {
    const response = await fetch(
      `${API_URL}/apiLivingSpace/getLivingSpaceTypeById/${id}`,
      { credentials: "include" }
    );
    //Se guarda la respuesta en una variable al ser solamente uno
    const res = await response.json();
    if (!response.ok) {
      throw new Error(`Error al cargar viviendas: ${response.status}`);
    }
    return res;
  } catch (err) {
    console.error("Error cargando viviendas", err);
    return err;
  }
}

export async function getLivingSpaceTypeByName(
  searchName,
  page = 0,
  size = 10
) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}/apiLivingSpace/getLivingSpaceTypeByName/${searchName}?page=${page}&size=${size}`,
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

export async function insertLivingSpaceTypes(playload) {
  try {
    const response = await fetch(
      `${API_URL}/apiLivingSpace/insertLivingSpaceType`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playload),
        credentials: "include",
      }
    );
    const data = await response.json();

    if (response.ok) {
      Alerts.showToastCloseSuccess("Vivienda creada exitosamente");
      return { ok: true, data };
    } else {
      Alerts.showToastCloseError(`Error creando vivienda: ${response.status}`);
      return { ok: false, data };
    }

    //Retorno un ok en true y la data
    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error creando vivienda. ${err}`);
    //Retrono de false, data null y el respectivo error
    return { ok: false, data: null, error: err };
  }
}

export async function updateLivingSpaceTypes(playload, id) {
  try {
    const response = await fetch(
      `${API_URL}/apiLivingSpace/updateLivingSpaceType/${id.value}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playload),
        credentials: "include",
      }
    );
    const data = await response.json();
    if (response.ok) {
      Alerts.showToastCloseSuccess("Vivienda actualizada exitosamente");
    } else {
      Alerts.showToastCloseError(
        `Error actualizando vivienda: ${response.status}`
      );
      console.log(response.status);
    }
    //Retorno un ok en true y la data
    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error actualizando vivienda. ${err}`);
    //Retrono de false, data null y el respectivo error
    return { ok: false, data: null, error: err };
    console.log(err);
  }
}

export async function deleteLivingSpaceTypes(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar esta vivienda?",
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
    const res = await fetch(
      `${API_URL}/apiLivingSpace/deleteLivingSpaceType/${id}`,
      { method: "DELETE", credentials: "include" }
    );
    if (!res.ok) {
      Alerts.showToastCloseError(
        "No ha sido posible eliminar la vivienda",
        res.status
      );
      return false;
    }
    Alerts.showToastCloseSuccess("Vivienda eliminado exitosamente");
    return true;
  } catch (err) {
    Alerts.showToastCloseError("No ha sido posible eliminar la vivienda", err);
  }
}
