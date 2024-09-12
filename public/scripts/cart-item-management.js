const cartItemUpdateFormElements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price');
// const cartBadgeElements = document.querySelectorAll('.nav-items .badge');
const cartBadgeElements = document.querySelectorAll('.tab-items .badge');

async function minCartItem(event) {
    event.preventDefault();

    const form = event.target.closest('form');

    let currentValue = +form.firstElementChild.value;
    form.firstElementChild.value = +currentValue - 1;

    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity = form.firstElementChild.value;

    await updateValues(form, productId, csrfToken, quantity);
}

async function plusCartItem(event) {
    event.preventDefault();

    const form = event.target.closest('form');

    let currentValue = +form.firstElementChild.value;
    form.firstElementChild.value = +currentValue + 1;

    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity = form.firstElementChild.value;

    await updateValues(form, productId, csrfToken, quantity);
}

async function updateValues(form, productId, csrfToken, quantity) {
    let response;
    try {
        response = await fetch('/cart/items', {
            method: 'PATCH',
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                _csrf: csrfToken,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
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

    // update the DOM (frontend)

    if (responseData.updatedCartData.updatedItemPrice === 0) {
        form.parentElement.parentElement.remove();
    }
    else {
        const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price');
        cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice; /* cartItemTotalPriceElement.textContent = responseData.updatedCartItem.updatedItemPrice; */
    }

    cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice;

    for (const cartBadgeElement of cartBadgeElements) {
        cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
    }
}

for (const formElement of cartItemUpdateFormElements) {
    const minButton = formElement.querySelector('.cart-min-btn');
    const plusButton = formElement.querySelector('.cart-plus-btn');
    
    minButton.addEventListener('click', minCartItem);
    plusButton.addEventListener('click', plusCartItem);
}

async function updateCartItem(event) {
    event.preventDefault();

    const form = event.target;

    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity = form.firstElementChild.value;

    let response;
    try {
        response = await fetch('/cart/items', {
            method: 'PATCH',
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                _csrf: csrfToken,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
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

    // update the DOM (frontend)

    if (responseData.updatedCartData.updatedItemPrice === 0) {
        form.parentElement.parentElement.remove();
    }
    else {
        const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price');
        cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice; /* cartItemTotalPriceElement.textContent = responseData.updatedCartItem.updatedItemPrice; */
    }

    cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice;

    for (const cartBadgeElement of cartBadgeElements) {
        cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
    }
}

// for (const formElement of cartItemUpdateFormElements) {
//     formElement.addEventListener('submit', updateCartItem);
// }