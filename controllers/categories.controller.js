const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const Product = require('../models/product.model');

async function getHome(req, res, next) {
    try {
        const categories = await Category.findAll();
        const promoProducts = await Product.findAllPromo();
        res.render('customer/products/home', { categories: categories, promoProducts: promoProducts });
    } catch (error) {
        next(error);
    }
}

async function getAllCategories(req, res, next) {
    try {
        const categories = await Category.findAll();
        res.render('customer/products/all-categories', { categories: categories });
    } catch (error) {
        next(error);
    }
}

async function getSubcategories(req, res, next) {
    try {
        const category = await Category.findById(req.params.catId);
        const subcategories = await Subcategory.findByParent(req.params.catId);
        res.render('customer/products/subcategories', { categoryName: category.title, categoryId: category.id, subcategories: subcategories });
    } catch (error) {
        next(error);
    }
}

async function getProducts(req, res, next) {
    try {
        const subcategory = await Subcategory.findById(req.params.subcatId);
        const products = await Product.findBySubcategory(req.params.subcatId);
        res.render('customer/products/products', { subcategoryName: subcategory.title, products: products });
    } catch (error) {
        next(error);
    }
}

async function getPromo(req, res, next) {
    try {
        const promoProducts = await Product.findAllPromo();
        res.render('customer/products/products', { subcategoryName: 'Promo', products: promoProducts });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getHome: getHome,
    getAllCategories: getAllCategories,
    getSubcategories: getSubcategories,
    getProducts: getProducts,
    getPromo: getPromo,
};
