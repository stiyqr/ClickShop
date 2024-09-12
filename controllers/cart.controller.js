const Product = require('../models/product.model');

function getCart(req, res) {
    res.render('customer/cart/cart');
}

async function addCartItem(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.body.productId);
    } catch (error) {
        next(error);
        return;
    }

    const cart = res.locals.cart;

    cart.addItem(product, req.body.quantity);
    req.session.cart = cart; // overwrite the cart in the session with the updated cart

    // no need to call req.session.save() because it will be called automatically
    // (we only need to call that if we then perform actions like redirect, which relies on that data to be updated to database)
    // we don't need it here because we are not submitting a form then redirecting back to this page (but we could do that)
    // but instead we want to use AJAX request (frontend) for adding item to cart

    res.status(201).json({
        message: 'Cart updated!',
        newTotalItems: cart.totalQuantity,
    });
}

function updateCartItem(req, res) {
    const cart = res.locals.cart;

    const updatedItemData = cart.updateItem(
        req.body.productId,
        +req.body.quantity
    );

    req.session.cart = cart;

    res.json({
        message: 'Item updated!',
        updatedCartData: {
            newTotalQuantity: cart.totalQuantity,
            newTotalPrice: cart.totalPrice,
            updatedItemPrice: updatedItemData.updatedItemPrice,
        },
    });
}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart,
    updateCartItem: updateCartItem,
};
