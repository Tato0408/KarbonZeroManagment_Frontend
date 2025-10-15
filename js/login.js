import * as Alerts from "../utils/alerts.js";
import {me, login} from "./services/authService.js"

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("login");
    const email_input = document.getElementById("usuariotxt");
    const password_input = document.getElementById("contraseniatxt");
    const hide_password = document.getElementById("hide-password");
    const icon = hide_password.getElementsByTagName("i")[0];

    hide_password.addEventListener("click", (e) => {
        if (icon.className == "bi bi-eye-fill") {
            icon.className = "bi bi-eye-slash-fill";
            password_input.setAttribute("type", "text");
        } else {
            icon.className = "bi bi-eye-fill";
            password_input.setAttribute("type", "password");
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = email_input.value.trim()
        const password = password_input.value.trim() 
        const btnIngresar = document.getElementById("login-button");

        let originalText;

        try {
            if (btnIngresar) {
                originalText = btnIngresar.innerHTML;
                btnIngresar.setAttribute("disabled", "disabled");
                btnIngresar.innerHTML = "Ingresando...";
            }

            await login(email, password);
            const info = await me();
            if(info.data.status === 0 || info.data.disabled === 1){
                Alerts.showToastCloseError("No tienes los permisos para ingresar al sistema")
                return;
            }
            if (info.ok) {
                window.location.href = "index.html";
            } else {
                Alerts.showToastCloseError("Error de inicio de sesión");
            }
        } catch (err) {
            Alerts.showToastCloseError("No fue posible iniciar sesión");
        } finally {
            if (btnIngresar) {
                btnIngresar.removeAttribute("disabled");
                if (originalText) {
                    btnIngresar.innerHTML = originalText;
                }
            }
        }
    });
});




