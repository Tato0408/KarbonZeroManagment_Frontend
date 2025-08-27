import * as Alerts from "../../../utils/alerts"

export async function getCarSize(page = 0, size = 10) {
    try{
        const response = await fetch(`http://localhost:8080/apiCar/getAllCarSizeService?page=${page}&size=${size}`);

        if(!response.ok){
            throw new Error(`Error al cargar los tamaños de carros: ${repspose.status}`)
        }
        return response.json();
    }
    catch(err){
        console.error("Error cargando tmaños de carros", err)
        return err;
    }
}

export async function getCarSizeById(id) {
    try{
        const response = await fetch (`http://localhost:8080/apiCar/getCarSizeById/${id}`);

        const res = await response.json();
        if(!response.ok){
            throw new Error(`Error al cargar los tamaños de carros: ${repspose.status}`)
        }
        return res;
    }
    catch(err){
        console.error("Error cargando tamaños de carros", err)
        return err;
    }
}

export async function insertCarSize(playload) {
    try{
        const response = await fetch(`http://localhost:8080/apiCar/insertCarSize`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playload)
        });

        const data = await response.json();

        if(response.ok){
            Alerts.showToastCloseSuccess("Tamaño de carro creado correctamente")
        }
        else{
            Alerts.showToastCloseError(`Error creando tamaño de carro: ${response.status}`)
        }

        return{ok:true, data}
    }
    catch(err){
        Alerts.showToastCloseError(`Error creando tamaño de carro. ${err}`)
        return{ok:false, data:null, error:err}
    }
}

export async function updateCarSize(playload, id) {
    try{
        const response = await fetch (`http://localhost:8080/apiCar/updateCarSize/${id.value}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playload)
        });

        const data = await response.json();
        if(response.ok){
            Alerts.showToastCloseSuccess("Tamaño de carro actualizado correctamente")
        }
        else{
            Alerts.showToastCloseError(`Error actualizando tamaño de carro: ${response.status}`)
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

export async function deleteCarSize(id) {
    const result = await  Swal.fire({
        title:"¿Estás seguro de eliminar este tamaño de carro?",
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
        const res = await fetch (`http://localhost:8080/apiCar/deleteCarSize/${id}`, {
            method: 'DELETE'
        });

        if(!res.ok){
            Alerts.showToastCloseError("No ha sido posible eliminar el tamaño de carro", response.status);
            return false;
        }
        Alerts.showToastCloseSuccess("Tamaño de carro eliminadu correctamente");
        return true;
    }
    catch(err){
        Alerts.showToastCloseError("No ha sido posible eliminar el tamaño de carro", err)
    }
}