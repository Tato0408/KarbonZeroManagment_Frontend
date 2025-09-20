import {me, logout} from "../services/authService.js"

export const auth = {
    ok: false,
    user: null
}

// Funcion que redirigira al usuario al login si no está autenticado, servirá para darle una capa de seguridad a los pages que lo necesiten
export async function  requiredAuth(redirect = true) {
    try {
        const info = await me();
        auth.ok = info.ok;
        auth.user = info.data;
    } catch (err) {
        auth.ok = false;
        auth.user = null;
    }

    if (!auth.ok && redirect) {
        window.location.replace("login.html");
    }

    return auth.ok;
    
}