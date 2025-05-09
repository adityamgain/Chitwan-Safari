const toggleButton = document.getElementById('menu-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

toggleButton.addEventListener('click', () => {
    navbarMenu.classList.toggle('show');
});
