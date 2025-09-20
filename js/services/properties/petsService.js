import { APIURL as API_URL } from "../../../utils/api_url.js";
import * as Alerts from "../../../utils/alerts";

export async function getPets(page = 0, size = 10) {
  try {
    const res = await fetch(
      `${API_URL}/apiPet/getAllPetType?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    if (!res.ok) throw new Error(`Error al cargar mascotas: ${res.status}`);
    const data = await res.json();

    // Mapear nombres de campos de la API al frontend
    data.content = data.content.map((p) => ({
      idPet: p.idPetType,
      name: p.namePetType,
      carbonFootprint: p.carbonFootPrint,
    }));
    return data;
  } catch (err) {
    console.error("Error cargando mascotas", err);
    return { content: [], number: 0, totalPages: 0 };
  }
}

export async function getPetTypeById(id) {
  try {
    const res = await fetch(`${API_URL}/apiPet/getPetTypeById/${id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Error al cargar mascota: ${res.status}`);
    const data = await res.json();
    return {
      idPet: data.idPetType,
      name: data.namePetType,
      carbonFootprint: data.carbonFootPrint,
    };
  } catch (err) {
    console.error("Error cargando mascota", err);
    return {};
  }
}

export async function getPetTypeByName(searchName, page = 0, size = 10) {
  try {
    const response = await fetch(
      `${API_URL}/apiPet/getPetTypeByName/${searchName}?page=${page}&size=${size}`,
      { credentials: "include" }
    );
    if (!response.ok) {
      throw new Error(`Error al buscar mascotas: ${response.status}`);
    }
    const data = await response.json();

    data.content = data.content.map((p) => ({
      idPet: p.idPetType,
      name: p.namePetType,
      carbonFootprint: p.carbonFootPrint,
    }));

    return data;
  } catch (error) {
    console.error(`Error fetching pets by name: ${error}`);
    return { content: [], number: 0, totalPages: 0 };
  }
}

export async function insertPet(payload) {
  try {
    const body = {
      namePetType: payload.name,
      carbonFootPrint: parseFloat(payload.carbonFootprint),
    };
    const res = await fetch(`${API_URL}/apiPet/insertPetType`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Error creando mascota: ${res.status}`);
    Alerts.showToastCloseSuccess("Mascota creada exitosamente");
    return { ok: true };
  } catch (err) {
    Alerts.showToastCloseError(`Error creando mascota. ${err}`);
    return { ok: false };
  }
}

export async function updatePetType(payload, id) {
  try {
    const body = {
      idPetType: id.value,
      namePetType: payload.name,
      carbonFootPrint: parseFloat(payload.carbonFootprint),
    };
    const res = await fetch(`${API_URL}/apiPet/updatePetType/${id.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Error actualizando mascota: ${res.status}`);
    Alerts.showToastCloseSuccess("Mascota actualizada exitosamente");
    return { ok: true };
  } catch (err) {
    Alerts.showToastCloseError(`Error actualizando mascota. ${err}`);
    return { ok: false };
  }
}

export async function deletePetType(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar esta mascota?",
    showDenyButton: true,
    confirmButtonText: "Eliminar",
    confirmButtonColor: "#DF4646",
    denyButtonColor: "#6d6c6c",
    denyButtonText: "Cancelar",
  });
  if (!result.isConfirmed) return false;

  try {
    const res = await fetch(`${API_URL}/apiPet/deletePetType/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Error eliminando mascota: ${res.status}`);
    Alerts.showToastCloseSuccess("Mascota eliminada exitosamente");
    return true;
  } catch (err) {
    Alerts.showToastCloseError("No ha sido posible eliminar la mascota", err);
    return false;
  }
}
