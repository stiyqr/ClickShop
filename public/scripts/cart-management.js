// const addToCartButtonElement = document.querySelector('#product-details button');
// const cartBadgeElements = document.querySelectorAll('.nav-items .badge');
const addToCartButtonElements = document.querySelectorAll('.add-to-cart-btn');
const cartBadgeElements = document.querySelectorAll('.tab-items .badge');

async function addToCart(event) {
    let addToCartButtonElement = event.target.closest('.add-to-cart-btn');
    const productId = addToCartButtonElement.dataset.productid;
    const csrfToken = addToCartButtonElement.dataset.csrf;

    let response;
    try {
        response = await fetch('/cart/items', {
            method: 'POST',
            body: JSON.stringify({
                productId: productId,
                quantity: 1,
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

    const responseData = await response.json();

    const newTotalQuantity = responseData.newTotalItems;

    for (const cartBadgeElement of cartBadgeElements) {
        cartBadgeElement.textContent = newTotalQuantity;
    }
}

// addToCartButtonElement.addEventListener('click', addToCart);
for (const addToCartButtonElement of addToCartButtonElements) {
    addToCartButtonElement.addEventListener('click', addToCart);
}
