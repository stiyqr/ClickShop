const deleteCategoryButtonElements = document.querySelectorAll('.product-item button'); // array of all delete product buttons in the page

async function deleteCategory(event) {
    const buttonElement = event.target;
    const categoryId = buttonElement.dataset.categoryid;
    const csrfToken = buttonElement.dataset.csrf;

    // Use 'fetch' to send a request to a url. For the same domain (e.g., localhost:3000),
    // use the absolute path ('/path'). For a different domain, include the full URL ('http://example.com/path').
    const response = await fetch('/admin/categories/' + categoryId + '?_csrf=' + csrfToken, {
        method: 'DELETE'
    });

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteCategoryButtonElement of deleteCategoryButtonElements) {
    deleteCategoryButtonElement.addEventListener('click', deleteCategory);
}