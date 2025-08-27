import * as Alerts from "../../../utils/alerts"

export async function getPets(page = 0, size = 10) {
    try {
        const response = await fetch(`http://localhost:8080/apiPet/getAllPetType?page=${page}&size=${size}`);
        if (!response.ok) {
            throw new Error(`Error al cargar mascotas: ${response.status}`)
        }
        return response.json();
    }
    catch (err) {
        console.error("Error cargando mascotas", err)
        return err;
    }
}

export async function getPetTypeById(id) {
    try {
        const response = await fetch(`http://localhost:8080/apiPet/getPetTypeById/${id}`);
        const res = await response.json();
        if (!response.ok) {
            throw new Error(`Error al cargar mascotas: ${response.status}`)
        }
        return res;
    }
    catch (err) {
        console.error("Error cargando mascotas", err)
        return err;
    }
}

export async function insertPet(playload) {
    try {
        const response = await fetch(`http://localhost:8080/apiPet/insertPetType`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playload)
        });
        const data = await response.json();

        if (response.ok) {
            Alerts.showToastCloseSuccess("Mascota creada exitosamente")
            return { ok: true, data }
        } else {
            Alerts.showToastCloseError(`Error creando mascotas: ${response.status}`)
            return { ok: false, data }
        }
        return { ok: true, data }
    }
    catch (err) {
        Alerts.showToastCloseError(`Error creando mascota. ${err}`)
        return { ok: false, data: null, error: err }
    }
}

export async function updatePetType(playload, id) {
    try {
        const response = await fetch(`http://localhost:8080/apiPet/updatePetType/${id.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playload)
        });
        const data = await response.json();
        if (response.ok) {
            Alerts.showToastCloseSuccess("Mascota actualizada exitosamente")
        }
        else {
            Alerts.showToastCloseError(`Error actualizando mascota: ${response.status}`)
            console.log(response.status)
        }
        return { ok: true, data }
    }
    catch (err) {
        Alerts.showToastCloseError(`Error actualizando mascota. ${err}`)
        return { ok: false, data: null, error: err }
        console.log(err)
    }
}

export async function deletePetType(id) {
    const result = await Swal.fire({
        title: "¿Estás seguro de eliminar esta mascota?",
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#DF4646",
        denyButtonColor: "#6d6c6c",
        denyButtonText: "Cancelar"
    })

    if (!result.isConfirmed) {
        return false;
    }

    try {
        const res = await fetch(`http://localhost:8080/apiPet/deletePetType/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            Alerts.showToastCloseError("No ha sido posible eliminar la mascota", res.status);
            return false;
        }
        Alerts.showToastCloseSuccess("Mascota eliminado exitosamente");
        return true
    }
    catch (err) {
        Alerts.showToastCloseError("No ha sido posible eliminar la mascota", err)
    }
}