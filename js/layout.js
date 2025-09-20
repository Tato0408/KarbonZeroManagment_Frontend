import { logout } from "./services/authService.js";

const sidebar = document.getElementById("sidebar");
const sidebarToggler = document.querySelector(".menu-toggle");
const mainContent = document.getElementById("main-content");

sidebarToggler.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

document.addEventListener("click", function (event) {
  const isClickInsideSidebar = sidebar.contains(event.target);
  const isClickOnToggle = sidebarToggler.contains(event.target);

  if (
    window.innerWidth <= 768 &&
    sidebar.classList.contains("show") &&
    !isClickInsideSidebar &&
    !isClickOnToggle
  ) {
    sidebar.classList.remove("show");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const btnLogout = document.getElementById("logout");
  btnLogout.addEventListener("click", async () => {
    const res = await logout();
    if (!res.ok) return; // Si no se pudo hacer logout no ir al login
    window.location.href = "login.html";
  });
});
