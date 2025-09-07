import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from "../../../utils/alerts";

//Exportar la función para importar en el controllador
export async function getCountries(page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiUser/getAllCountries?page=${page}&size=${size}`
    );
    //Evaluación de respuesta
    if (!response.ok) {
      throw new Error(`Error al cargar paises: ${response.status}`);
    }
    //Retorno de respuesta en formato json
    return response.json();
  } catch (err) {
    console.error("Error cargando paises", err);
    return err;
  }
}

export async function getCountriesById(id) {
  try {
    const response = await fetch(
      `${API_URL}/apiUser/getCountryById/${id}`
    );
    //Se guarda la respuesta en una variable al ser solamente uno
    const res = await response.json();
    if (!response.ok) {
      throw new Error(`Error al cargar paises: ${response.status}`);
    }
    return res;
  } catch (err) {
    console.error("Error cargando paises", err);
    return err;
  }
}

export async function getCountryByName(searchName, page = 0, size = 10) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}/apiUser/getCountryByName/${searchName}?page=${page}&size=${size}`
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

export async function insertCountry(playload) {
  try {
    const response = await fetch(
      `${API_URL}/apiUser/insertCountry`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playload),
      }
    );
    const data = await response.json();

    if (response.ok) {
      Alerts.showToastCloseSuccess("País creada exitosamente");
      return { ok: true, data };
    } else {
      Alerts.showToastCloseError(`Error creando paises: ${response.status}`);
      return { ok: false, data };
    }

    //Retorno un ok en true y la data
    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error creando país. ${err}`);
    //Retrono de false, data null y el respectivo error
    return { ok: false, data: null, error: err };
  }
}

export async function updateCountry(playload, id) {
  try {
    const response = await fetch(
      `${API_URL}/apiUser/updateCountry/${id.value}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playload),
      }
    );
    const data = await response.json();
    if (response.ok) {
      Alerts.showToastCloseSuccess("País actualizada exitosamente");
    } else {
      Alerts.showToastCloseError(`Error actualizando pais: ${response.status}`);
      console.log(response.status);
    }
    //Retorno un ok en true y la data
    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error actualizando país. ${err}`);
    //Retrono de false, data null y el respectivo error
    return { ok: false, data: null, error: err };
    console.log(err);
  }
}

export async function deleteCountry(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar este país?",
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
      `${API_URL}/apiUser/deleteCountry/${id}`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      Alerts.showToastCloseError(
        "No ha sido posible eliminar el paíß",
        res.status
      );
      return false;
    }
    Alerts.showToastCloseSuccess("País eliminado exitosamente");
    return true;
  } catch (err) {
    Alerts.showToastCloseError("No ha sido posible eliminar el país", err);
  }
}
