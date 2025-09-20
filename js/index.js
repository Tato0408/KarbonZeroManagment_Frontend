import { logout } from "./services/authService.js";

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  const btnLogout = document.getElementById("logout");
  btnLogout.addEventListener("click", async () => {
    logout();
    window.location.href = "login.html";
  });
});
