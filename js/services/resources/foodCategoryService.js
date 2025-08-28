import * as Alerts from '../../../utils/alerts'

///Exportamos la funcion para poder importarla en nuestro controlador
export async function getCategories() {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        ///!Hacemos el get, nada nuevo
        const response = await fetch(`http://localhost:8080/apiFood/getAllFoodCategories`);
        ///Si esta malo pues aja, mandamos error
        if (!response.ok) {
            Alerts.showToastCloseError(`Error cargando categorias: ${response.status}`)
        }
        ///Retornamos la respuesta en formato json
        return response.json();
    } catch (error) {
        Alerts.showToastCloseError(`Error cargando categorias ${error}`)
        throw error;
    }
}

export async function getCategoriesPagination(page, size ) {
    try {
        ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
        ///!Hacemos el get, nada nuevo
        const response = await fetch(`http://localhost:8080/apiFood/getAllFoodCategoriesPagination?page=${page}&size=${size}`);
        ///Si esta malo pues aja, mandamos error
        if (!response.ok) {
            Alerts.showToastCloseError(`Error cargando categorias: ${response.status}`)
        }
        ///Retornamos la respuesta en formato json
        return response.json();
    } catch (error) {
        Alerts.showToastCloseError(`Error cargando categorias ${error}`)
        throw error;
    }
}

export async function getFoodCategoryById(id){
    try{
        const response = await fetch (`http://localhost:8080/apiFood/getFoodCategoryById/${id}`);
        //Se guarda la respuesta en una variable al ser solamente uno
        const res = await response.json();
         if(!response.ok){
            throw new Error(`Error al cargar comidas: ${repspose.status}`)
        }
        return res;
    }
    catch(err){
        console.error("Error cargando comidas", err)
        return err;
    }
}

export async function getCategoryByName(searchName, page = 0, size = 10) {
  try {
    ///Hacemos la peticion a nuestra api/ API_URL esta definida en .env.local ahorita es = localhost:8080/
    const response = await fetch(`http://localhost:8080/apiFood/getFoodCategoryByFoodCategoryName/${searchName}?page=${page}&size=${size}`
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

export async function insertFoodCategory(playload){
    try{
        const response = await fetch (`http://localhost:8080/apiFood/insertFoodCategory`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playload)
        });
        const data = await response.json();

        if(response.ok){
            Alerts.showToastCloseSuccess("Categoria de alimento creada exitosamente")
        }
        else{
            Alerts.showToastCloseError(`Error creando categoria: ${response.status}`)
        }

        //Retorno un ok en true y la data
        return {ok:true, data}
    }
    catch(err){
        Alerts.showToastCloseError(`Error creando categoria. ${err}`)
        //Retrono de false, data null y el respectivo error
        return {ok:false, data:null, error:err}
    }
}

export async function updateFoodCategory(playload, id){
    try{
        const response = await fetch (`http://localhost:8080/apiFood/updateFoodCategory/${id.value}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playload)
        });
         const data = await response.json();
        if(response.ok){
            Alerts.showToastCloseSuccess("Categoria actualizada exitosamente")
        }
        else{
            Alerts.showToastCloseError(`Error actualizando categoria: ${response.status}`)
            console.log(response.status)
        }
        //Retorno un ok en true y la data
        return {ok:true, data}
    }
    catch(err)
    {
        Alerts.showToastCloseError(`Error actualizando categoria. ${err}`)
        //Retrono de false, data null y el respectivo error
        return {ok:false, data:null, error:err}
        console.log(err)
    }
}

export async function deleteFoodCategory(id){
    const result = await  Swal.fire({
        title:"¿Estás seguro de eliminar esta categoria de alimento?. Esta acción hará que los alimentos relacionados con la categora sean elimminados tambien ",
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
        const res =  await fetch (`http://localhost:8080/apiFood/deleteFoodCategory/${id}`, {method:'DELETE'});
        if(!res.ok){
            Alerts.showToastCloseError("No ha sido posible eliminar la categoria", response.status);
            return false;
        }
        Alerts.showToastCloseSuccess("Categoria de alimento eliminada exitosamente");
        return true
    }
    catch(err){
        Alerts.showToastCloseError("No ha sido posible eliminar la categoria", err)
    }
}