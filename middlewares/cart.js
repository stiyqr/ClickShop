const Cart = require('../models/cart.model');

function initializeCart(req, res, next) {
    let cart;

    if (!req.session.cart) {
        cart = new Cart();
    }
    else {
        // re-initialize new cart using items in session's cart,
        // because if Cart object stored in session, the items might be stored but the methods might not be stored
        const sessionCart = req.session.cart;
        cart = new Cart(sessionCart.items, sessionCart.totalQuantity, sessionCart.totalPrice); 
    }

    res.locals.cart = cart;

    next();
}

module.exports = initializeCart;