import * as Alerts from "../../../utils/alerts"

//Exportar la función para importar en el controllador 
export async function getAllFuelType(page = 0, size = 10) {
    try {
        const response = await fetch(`http://localhost:8080/apiCar/getAllFuelType?page=${page}&size=${size}`);
        //Evaluación de respuesta
        if (!response.ok) {
            throw new Error(`Error al cargar tipos de combustible: ${response.status}`)
        }
        //Retorno de respuesta en formato json
        return response.json();

    }
    catch (err) {
        console.error("Error cargando tipos de combustible", err)
        return err;
    }
}

export async function getFuelTypeById(id) {
    try {
        const response = await fetch(`http://localhost:8080/apiCar/getFuelTypeById/${id}`);
        //Se guarda la respuesta en una variable al ser solamente uno
        const res = await response.json();
        if (!response.ok) {
            throw new Error(`Error al cargar tipos de combustible: ${response.status}`)
        }
        return res;
    }
    catch (err) {
        console.error("Error cargando tipos de combustible", err)
        return err;
    }
}

export async function insertFuelType(playload) {
    try {
        const response = await fetch(`http://localhost:8080/apiCar/insertFuelType`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playload)
        });
        const data = await response.json();

        if (response.ok) {
            Alerts.showToastCloseSuccess("tipos de combustible creado exitosamente")
            return { ok: true, data }
        } else {
            Alerts.showToastCloseError(`Error creando tipos de combustible: ${response.status}`)
            return { ok: false, data }
        }

        //Retorno un ok en true y la data
        return { ok: true, data }
    }
    catch (err) {
        Alerts.showToastCloseError(`Error creando tipos de combustible. ${err}`)
        //Retrono de false, data null y el respectivo error
        return { ok: false, data: null, error: err }
    }
}

export async function updateFuelType(playload, id) {
    try {
        const response = await fetch(`http://localhost:8080/apiUser/updateFuelType/${id.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playload)
        });
        const data = await response.json();
        if (response.ok) {
            Alerts.showToastCloseSuccess("tipos de combustible actualizado exitosamente")
        }
        else {
            Alerts.showToastCloseError(`Error actualizando tipos de combustible: ${response.status}`)
            console.log(response.status)
        }
        //Retorno un ok en true y la data
        return { ok: true, data }
    }
    catch (err) {
        Alerts.showToastCloseError(`Error actualizando tipos de combustible. ${err}`)
        //Retrono de false, data null y el respectivo error
        return { ok: false, data: null, error: err }
        console.log(err)
    }
}

export async function deleteFuelType(id) {
    const result = await Swal.fire({
        title: "¿Estás seguro de eliminar este tipo de combustible?",
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
        const res = await fetch(`http://localhost:8080/apiCar/deleteFuelType/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            Alerts.showToastCloseError("No ha sido posible eliminar el tipo de combustible", res.status);
            return false;
        }
        Alerts.showToastCloseSuccess("tipo de combustible eliminado exitosamente");
        return true
    }
    catch (err) {
        Alerts.showToastCloseError("No ha sido posible eliminar el tipo de combustible", err)
    }
}