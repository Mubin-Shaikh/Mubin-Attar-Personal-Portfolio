// Add class navbarDark on navbar scroll
const header = document.querySelector('.navbar');
window.onscroll = function() {
    const top = window.scrollY;
    if (top >= 100) {
        header.classList.add('navbarDark');
    } else {
        header.classList.remove('navbarDark');
    }
}

// Collapse navbar after click on small devices
const navLinks = document.querySelectorAll('.nav-item');
const menuToggle = document.getElementById('navbarSupportedContent');

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        new bootstrap.Collapse(menuToggle).toggle();
    });
});
