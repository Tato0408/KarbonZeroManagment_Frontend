
const sidebar = document.getElementById("sidebar");
const sidebarToggler = document.querySelector(".menu-toggle");
const mainContent = document.getElementById("main-content");

sidebarToggler.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

document.addEventListener("click", function (event) {
  const isClickInsideSidebar = sidebar.contains(event.target);
  const isClickOnToggle = sidebarToggler.contains(event.target);


  if (window.innerWidth <= 768 && sidebar.classList.contains("show") && !isClickInsideSidebar && !isClickOnToggle) {
    sidebar.classList.remove("show");
  }
});


