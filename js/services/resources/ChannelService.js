import * as Alerts from "../../../utils/alerts"

export async function getChannels(page = 0, size = 10) {
    try{
        const response = await fetch(`http://localhost:8080/apiCompany/getAllChannel?page=${page}&size=${size}`);

        if(!response.ok){
            throw new Error(`Error al cargar los canales: ${repspose.status}`)
        }
        return response.json();
    }
    catch(err){
        console.error("Error cargando canales", err)
        return err;
    }
}

export async function getChannelById(id) {
    try{
        const response = await fetch (`http://localhost:8080/apiCompany/getChannelById/${id}`);

        const res = await response.json();
        if(!response.ok){
            throw new Error(`Error al cargar los canales: ${repspose.status}`)
        }
        return res;
    }
    catch(err){
        console.error("Error cargando canales", err)
        return err;
    }
}

export async function insertChannel(playload) {
    try{
        const response = await fetch(`http://localhost:8080/apiCompany/insertChannel`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playload)
        });

        const data = await response.json();

        if(response.ok){
            Alerts.showToastCloseSuccess("Canal creado correctamente")
        }
        else{
            Alerts.showToastCloseError(`Error creando canal: ${response.status}`)
        }

        return{ok:true, data}
    }
    catch(err){
        Alerts.showToastCloseError(`Error creando canal. ${err}`)
        return{ok:false, data:null, error:err}
    }
}

export async function updateChannel(playload, id) {
    try{
        const response = await fetch (`http://localhost:8080/apiCompany/updateChannel/${id.value}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playload)
        });

        const data = await response.json();
        if(response.ok){
            Alerts.showToastCloseSuccess("Canal actualizado correctamente")
        }
        else{
            Alerts.showToastCloseError(`Error actualizando canal: ${response.status}`)
            console.log(response.status)
        }
        
        return{ok:true, data}
    }
    catch(err){
        Alerts.showToastCloseError(`Error actualizando canal. ${err}`)
        return {ok:true, data:null, error:err}
        console.log(err)
    }
}

export async function deleteChannel(id) {
    const result = await  Swal.fire({
        title:"¿Estás seguro de eliminar este canal?",
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
        const res = await fetch (`http://localhost:8080/apiCompany/deleteChannel/${id}`, {
            method: 'DELETE'
        });

        if(!res.ok){
            Alerts.showToastCloseError("No ha sido posible eliminar el canal", response.status);
            return false;
        }
        Alerts.showToastCloseSuccess("Canal eliminado correctamente");
        return true;
    }
    catch(err){
        Alerts.showToastCloseError("No ha sido posible eliminar el canal", err)
    }
}