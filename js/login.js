const button = document.getElementById("login-button");

function open_layout () {
    window.location.href = "../layout.html";
};

button.addEventListener("click", e => {
    open_layout();
});


const password_input = document.getElementById("contraseñatxt")
const hide_password = document.getElementById("hide-password");
const icon = hide_password.getElementsByTagName("i")[0];


hide_password.addEventListener("click", e => {
    if (icon.className == "bi bi-eye-fill") {
        icon.className = "bi bi-eye-slash-fill";
        password_input.setAttribute("type", "text");
    }
    else {
        icon.className = "bi bi-eye-fill";
        password_input.setAttribute("type", "password");

    };
});