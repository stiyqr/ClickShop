const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

function toggleMobileMenu() {
    mobileMenuElement.classList.toggle('open');
    //mobileMenuElement.style.display = (mobileMenuElement.style.display === 'none' ? 'block' : 'none');
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);