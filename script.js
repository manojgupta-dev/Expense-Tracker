const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");


menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("menu-open");

    menuBtn.classList.toggle("menu-open");

});
const greeting = document.querySelector("#greeting");

const hour = new Date().getHours();

if (hour < 12) {
    greeting.textContent = "Good Morning 👋";
} else if (hour < 17) {
    greeting.textContent = "Good Afternoon ☀️";
} else {
    greeting.textContent = "Good Evening 🌙";
}