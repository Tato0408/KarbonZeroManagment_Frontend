import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from "../../../utils/alerts";

//Exportar la función para importar en el controllador
export async function getCarSize(page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiCar/getAllCarSize?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    //Evaluación de respuesta
    if (!response.ok) {
      throw new Error(`Error al cargar tamaño de carro: ${response.status}`);
    }
    //Retorno de respuesta en formato json
    return response.json();
  } catch (err) {
    console.error("Error cargando tamaño de carro", err);
    return err;
  }
}

export async function getCarSizeById(id) {
  try {
    const response = await fetch(`${API_URL}/apiCar/getCarSizeById/${id}`, {
      credentials: "include",
    });
    //Se guarda la respuesta en una variable al ser solamente uno
    const res = await response.json();
    if (!response.ok) {
      throw new Error(`Error al cargar tamaño de carro: ${response.status}`);
    }
    return res;
  } catch (err) {
    console.error("Error cargando tamaño de carro", err);
    return err;
  }
}

export async function getCarByName(searchName, page = 0, size = 10) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(
      `${API_URL}/apiCar/getCarSizeByName/${searchName}?page=${page}&size=${size}`,
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

export async function insertCarSize(playload) {
  try {
    const response = await fetch(`${API_URL}/apiCar/insertCarSize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playload),
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      Alerts.showToastCloseSuccess("tamaño de carro creado exitosamente");
      return { ok: true, data };
    } else {
      Alerts.showToastCloseError(
        `Error creando tamaño de carro: ${response.status}`
      );
      return { ok: false, data };
    }

    //Retorno un ok en true y la data
    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error creando tamaño de carro. ${err}`);
    //Retrono de false, data null y el respectivo error
    return { ok: false, data: null, error: err };
  }
}

export async function updateCarSize(playload, id) {
  try {
    const response = await fetch(
      `${API_URL}/apiCar/updateCarSize/${id.value}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playload),
        credentials: "include",
      }
    );
    const data = await response.json();
    if (response.ok) {
      Alerts.showToastCloseSuccess("tamaño de carro actualizado exitosamente");
    } else {
      Alerts.showToastCloseError(
        `Error actualizando tamaño de carro: ${response.status}`
      );
      console.log(response.status);
    }
    //Retorno un ok en true y la data
    return { ok: true, data };
  } catch (err) {
    Alerts.showToastCloseError(`Error actualizando tamaño de carro. ${err}`);
    //Retrono de false, data null y el respectivo error
    return { ok: false, data: null, error: err };
    console.log(err);
  }
}

export async function deleteCarSize(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar este tamaño de carro?",
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
    const res = await fetch(`${API_URL}/apiCar/deleteCarSize/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      Alerts.showToastCloseError(
        "No ha sido posible eliminar el tamaño de carro",
        res.status
      );
      return false;
    }
    Alerts.showToastCloseSuccess("tamaño de carro eliminado exitosamente");
    return true;
  } catch (err) {
    Alerts.showToastCloseError(
      "No ha sido posible eliminar el tamaño de carro",
      err
    );
  }
}
