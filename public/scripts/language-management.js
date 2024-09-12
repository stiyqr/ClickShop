const langDropdownBtnElement = document.getElementById('lang-dropdown-btn');
const langDropdownContentElement = document.getElementById('lang-dropdown-content');
const langEnBtnElement = document.getElementById('lang-en-btn');
const langIdBtnElement = document.getElementById('lang-id-btn');
const enLanguageElements = document.querySelectorAll('.lang-en');
const idLanguageElements = document.querySelectorAll('.lang-id');

function toggleDropdown() {
    langDropdownContentElement.classList.toggle('show');
}

function displayEnglish() {
    for (const enLanguageElement of enLanguageElements) {
        enLanguageElement.style.display = 'block';
    }

    for (const idLanguageElement of idLanguageElements) {
        idLanguageElement.style.display = 'none';
    }
}

function displayIndonesian() {
    for (const enLanguageElement of enLanguageElements) {
        enLanguageElement.style.display = 'none';
    }

    for (const idLanguageElement of idLanguageElements) {
        idLanguageElement.style.display = 'block';
    }
}

async function getLanguage() {
    const csrfToken = langDropdownBtnElement.dataset.csrf;

    const response = await fetch('/getLang' + '?_csrf=' + csrfToken, {
        method: 'GET'
    });

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    const responseData = await response.json();

    if (responseData.langData.lang === 'id') {
        displayIndonesian();
    }
    else {
        displayEnglish();
    }
}

async function setLanguageEnglish() {
    const csrfToken = langDropdownBtnElement.dataset.csrf;

    let response;
    try {
        response = await fetch('/setLang', {
            method: 'PATCH',
            body: JSON.stringify({
                lang: 'en',
                _csrf: csrfToken
            }),
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    displayEnglish();
    toggleDropdown();
}

async function setLanguageIndonesian() {
    const csrfToken = langDropdownBtnElement.dataset.csrf;

    let response;
    try {
        response = await fetch('/setLang', {
            method: 'PATCH',
            body: JSON.stringify({
                lang: 'id',
                _csrf: csrfToken
            }),
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    displayIndonesian();
    toggleDropdown();
}

function closeDropdown() {
    if (langDropdownContentElement.classList.contains('show')) {
        langDropdownContentElement.classList.remove('show');
    }
}

langDropdownBtnElement.addEventListener('click', toggleDropdown);
document.addEventListener("DOMContentLoaded", getLanguage, false);
langEnBtnElement.addEventListener('click', setLanguageEnglish);
langIdBtnElement.addEventListener('click', setLanguageIndonesian);