const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');

async function getProducts(req, res, next) {
    try {
        const products = await Product.findAll();
        res.render('admin/products/manage-products', { products: products });
    } catch (error) {
        next(error);
        return;
    }
}

async function getNewProduct(req, res) {
    try {
        const categories = await Category.findAll();
        res.render('admin/products/new-product', { categories: categories });
    } catch (error) {
        next(error);
    }
}

async function createNewProduct(req, res, next) {
    // haven't handled (in backend) if something is not uploaded (user deleted 'required' field in frontend html to submit)
    const product = new Product({
        ...req.body,
        image: req.file.filename,
    });

    try {
        await product.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        await product.getCategoryNames();
        const categories = await Category.findAll();
        res.render('admin/products/update-product', { product: product, categories: categories });
    } catch (error) {
        next(error);
    }
}

async function updateProduct(req, res, next) {
    const product = new Product({
        ...req.body,
        _id: req.params.id,
    });

    if (req.file) {
        // replace old image with new one if an image is uploaded
        product.replaceImage(req.file.filename);
    }

    try {
        await product.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        await product.remove();
    } catch (error) {
        return next(error);
    }

    // don't redirect, because remove() is sending a frontend based javascript request (DELETE) (check AJAX)
    // frontend based js request don't load a new page, but stay in the existing page
    // so by default it doesn't support redirect response
    // res.redirect('/admin/products');

    // so we send a response in json format instead
    res.json({ message: 'Deleted product!' });
}

async function getOrders(req, res, next) {
    try {
        const orders = await Order.findAll();
        res.render('admin/orders/admin-orders', {
            orders: orders,
        });
    } catch (error) {
        next(error);
    }
}

async function updateOrder(req, res, next) {
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;

    try {
        const order = await Order.findById(orderId);

        order.status = newStatus;

        await order.save();

        res.json({ message: 'Order updated', newStatus: newStatus });
    } catch (error) {
        next(error);
    }
}

async function getCategories(req, res) {
    try {
        const categories = await Category.findAll();
        res.render('admin/products/manage-categories', { categories: categories });
    } catch (error) {
        next(error);
    }
}

function getNewCategory(req, res) {
    res.render('admin/products/new-category');
}

async function createNewCategory(req, res, next) {
    const category = new Category({
        title: req.body.title,
        image: req.file.filename,
    });

    try {
        await category.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/categories');
}

async function getUpdateCategory(req, res, next) {
    try {
        const category = await Category.findById(req.params.id);
        res.render('admin/products/update-category', { category: category });
    } catch (error) {
        next(error);
    }
}

async function updateCategory(req, res, next) {
    const category = new Category({
        title: req.body.title,
        _id: req.params.id
    });

    if (req.file) {
        category.replaceImage(req.file.filename);
    }

    try {
        await category.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/categories');
}

async function deleteCategory(req, res, next) {
    let category;
    try {
        category = await Category.findById(req.params.id);
        await category.remove();
    } catch (error) {
        return next(error);
    }

    // don't redirect, because remove() is sending a frontend based javascript request (DELETE) (check AJAX)
    // frontend based js request don't load a new page, but stay in the existing page
    // so by default it doesn't support redirect response
    // res.redirect('/admin/products');

    // so we send a response in json format instead
    res.json({ message: 'Deleted category!' });
}

async function getNewSubcategory(req, res) {
    try {
        const categories = await Category.findAll();
        res.render('admin/products/new-subcategory', { categories: categories });
    } catch (error) {
        next(error);
    }
}

async function createNewSubcategory(req, res, next) {
    const subcategory = new Subcategory({
        ...req.body,
        image: req.file.filename,
    });

    try {
        await subcategory.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/categories');
}

async function getUpdateSubcategory(req, res, next) {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        const categories = await Category.findAll();
        res.render('admin/products/update-subcategory', { subcategory: subcategory, categories: categories });
    } catch (error) {
        next(error);
    }
}

async function updateSubcategory(req, res, next) {
    const subcategory = new Subcategory({
        ...req.body,
        _id: req.params.id
    });

    if (req.file) {
        subcategory.replaceImage(req.file.filename);
    }

    try {
        await subcategory.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/categories');
}

async function deleteSubcategory(req, res, next) {
    let subcategory;
    try {
        subcategory = await Subcategory.findById(req.params.id);
        await subcategory.remove();
    } catch (error) {
        return next(error);
    }

    // don't redirect, because remove() is sending a frontend based javascript request (DELETE) (check AJAX)
    // frontend based js request don't load a new page, but stay in the existing page
    // so by default it doesn't support redirect response
    // res.redirect('/admin/products');

    // so we send a response in json format instead
    res.json({ message: 'Deleted subcategory!' });
}

async function updateProductForm(req, res, next) {
    const parentCategory = req.body.parentCategory;

    try {
        const subcategories = await Subcategory.findByParent(parentCategory);

        res.json({ message: 'Subcategories fetched', subcategories: subcategories });
    } catch (error) {
        next(error);
    }
}

async function getPromo(req, res, next) {
    try {
        const promo = await Product.findAllPromo();
        res.render('admin/products/manage-promo', { products: promo });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProducts: getProducts,
    getNewProduct: getNewProduct,
    createNewProduct: createNewProduct,
    getUpdateProduct: getUpdateProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    getOrders: getOrders,
    updateOrder: updateOrder,
    getCategories: getCategories,
    getNewCategory: getNewCategory,
    createNewCategory: createNewCategory,
    getUpdateCategory: getUpdateCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory,
    getNewSubcategory: getNewSubcategory,
    createNewSubcategory: createNewSubcategory,
    getUpdateSubcategory: getUpdateSubcategory,
    updateSubcategory: updateSubcategory,
    deleteSubcategory: deleteSubcategory,
    updateProductForm: updateProductForm,
    getPromo: getPromo,
};
