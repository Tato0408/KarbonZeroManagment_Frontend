import * as Alerts from "../../../utils/alerts"

export async function getCompanies(page = 0, size = 10) {
    try{
        const response = await fetch(`http://localhost:8080/apiCompany/getAllCompany?page=${page}&size=${size}`);

        if(!response.ok){
            throw new Error(`Error al cargar las compañias: ${repspose.status}`)
        }
        return response.json();
    }
    catch(err){
        console.error("Error cargando compañias", err)
        return err;
    }
}

export async function getCompanyById(id) {
    try{
        const response = await fetch (`http://localhost:8080/apiCompany/getCompanyById/${id}`);

        const res = await response.json();
        if(!response.ok){
            throw new Error(`Error al cargar las compañias: ${repspose.status}`)
        }
        return res;
    }
    catch(err){
        console.error("Error cargando compañias", err)
        return err;
    }
}

export async function insertCompany(playload) {
    try{
        const response = await fetch(`http://localhost:8080/apiCompany/insertCompany`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playload)
        });

        const data = await response.json();

        if(response.ok){
            Alerts.showToastCloseSuccess("Compañia creada correctamente")
        }
        else{
            Alerts.showToastCloseError(`Error creacndo compañia: ${response.status}`)
        }

        return{ok:true, data}
    }
    catch(err){
        Alerts.showToastCloseError(`Error creando compañia. ${err}`)
        return{ok:false, data:null, error:err}
    }
}

export async function updateCompany(playload, id) {
    try{
        const response = await fetch (`http://localhost:8080/apiCompany/updateCompany/${id.value}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playload)
        });

        const data = await response.json();
        if(response.ok){
            Alerts.showToastCloseSuccess("Compañia actualizada correctamente")
        }
        else{
            Alerts.showToastCloseError(`Error actualizando compañia: ${response.status}`)
            console.log(response.status)
        }
        
        return{ok:true, data}
    }
    catch(err){
        Alerts.showToastCloseError(`Error actualizando compañia. ${err}`)
        return {ok:true, data:null, error:err}
        console.log(err)
    }
}

export async function deleteCompany(id) {
    const result = await  Swal.fire({
        title:"¿Estás seguro de eliminar esta compañia?",
        showDenyButton: true,
        confirmButtonText:"Eliminar",
        confirmButtonColor: "#DF4646",
        denyButtonColor:"#6d6c6c",
        denyButtonText:"Cancelar"
    })

    if(!result.isConfirmed){
        return false;
    }

    try{
        const res = await fetch (`http://localhost:8080/apiCompany/deleteCompany/${id}`, {
            method: 'DELETE'
        });

        if(!res.ok){
            Alerts.showToastCloseError("No ha sido posible eliminar la compañia", response.status);
            return false;
        }
        Alerts.showToastCloseSuccess("Compañia eliminada correctamente");
        return true;
    }
    catch(err){
        Alerts.showToastCloseError("No ha sido posible eliminar la compañia", err)
    }
}