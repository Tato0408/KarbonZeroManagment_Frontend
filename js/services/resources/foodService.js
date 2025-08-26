import * as Alerts from "../../../utils/alerts"

//Exportar la función para importar en el controllador 
export async function getFood(page = 0, size = 10){
    try{
        const response = await fetch (`http://localhost:8080/apiFood/getAllFoods?page=${page}&size=${size}`);
        //Evaluación de respuesta
        if(!response.ok){
            throw new Error(`Error al cargar alimentos: ${response.status}`)
        }
        //Retorno de respuesta en formato json
        return response.json();

    }
    catch(err){
        console.error("Error cargando alimentos", err)
        return err;
    }
}

export async function getFoodById(id){
    try{
        const response = await fetch (`http://localhost:8080/apiFood/getFoodById/${id}`);
        //Se guarda la respuesta en una variable al ser solamente uno
        const res = await response.json();
         if(!response.ok){
            throw new Error(`Error al cargar alimentos: ${repspose.status}`)
        }
        return res;
    }
    catch(err){
        console.error("Error cargando alimentos", err)
        return err;
    }
}

export async function insertFood(playload){
    try{
        const response = await fetch (`http://localhost:8080/apiFood/insertFood`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playload)
        });
        const data = await response.json();

        if(response.ok){
            Alerts.showToastCloseSuccess("Alimento creada exitosamente")
        }
        else{
            Alerts.showToastCloseError(`Error creando alimento: ${response.status}`)
        }

        //Retorno un ok en true y la data
        return {ok:true, data}
    }
    catch(err){
        Alerts.showToastCloseError(`Error creando alimento. ${err}`)
        //Retrono de false, data null y el respectivo error
        return {ok:false, data:null, error:err}
    }
}

export async function updateFood(playload, id){
    try{
        const response = await fetch (`http://localhost:8080/apiFood/updateFood/${id.value}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playload)
        });
         const data = await response.json();
        if(response.ok){
            Alerts.showToastCloseSuccess("Alimento actualizada exitosamente")
        }
        else{
            Alerts.showToastCloseError(`Error actualizando alimento: ${response.status}`)
            console.log(response.status)
        }
        //Retorno un ok en true y la data
        return {ok:true, data}
    }
    catch(err)
    {
        Alerts.showToastCloseError(`Error actualizanndo alimento. ${err}`)
        //Retrono de false, data null y el respectivo error
        return {ok:false, data:null, error:err}
        console.log(err)
    }
}

export async function deleteFood(id){
    const result = await  Swal.fire({
        title:"¿Estás seguro de eliminar este alimento?",
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
        const res =  await fetch (`http://localhost:8080/apiFood/deleteFood/${id}`, {method:'DELETE'});
        if(!res.ok){
            Alerts.showToastCloseError("No ha sido posible eliminar el alimento", res.status);
            return false;
        }
        Alerts.showToastCloseSuccess("Alimento eliminado exitosamente");
        return true
    }
    catch(err){
        Alerts.showToastCloseError("No ha sido posible eliminar el alimento", err)
    }
}