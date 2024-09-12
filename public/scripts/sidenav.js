const accountBtnElement = document.getElementById('account-btn');
const sidenavElement = document.getElementById('sidenav');
const sidenavBgElement = document.getElementById('sidenav-bg');

function toggleSidenav(event) {
    if (event.target !== sidenavElement) {
        sidenavBgElement.classList.toggle('open');
        sidenavElement.classList.toggle('open');
    }
}

accountBtnElement.addEventListener('click', toggleSidenav);
sidenavBgElement.addEventListener('click', toggleSidenav);

function goBack() {
    history.back();
}

window.addEventListener('pageshow', function(event) {
    if (event.persisted || (performance && performance.navigation.type === 2)) {
        location.reload();
    }
});