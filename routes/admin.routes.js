const express = require('express');

const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');
const categoryImageUploadMiddleware = require('../middlewares/category-image-upload');

const router = express.Router();

router.get('/products', adminController.getProducts);

router.get('/products/new', adminController.getNewProduct);

router.patch('/products/new', adminController.updateProductForm);

router.post('/products', imageUploadMiddleware, adminController.createNewProduct);

router.get('/products/:id', adminController.getUpdateProduct);

router.post('/products/:id', imageUploadMiddleware, adminController.updateProduct);

router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getOrders);

router.patch('/orders/:id', adminController.updateOrder);

router.get('/categories', adminController.getCategories)

router.get('/categories/new', adminController.getNewCategory);

router.post('/categories', categoryImageUploadMiddleware, adminController.createNewCategory);

router.get('/categories/:id', adminController.getUpdateCategory);

router.post('/categories/:id', categoryImageUploadMiddleware, adminController.updateCategory);

router.delete('/categories/:id', adminController.deleteCategory);

router.get('/subcategories/new', adminController.getNewSubcategory);

router.post('/subcategories', categoryImageUploadMiddleware, adminController.createNewSubcategory);

router.get('/subcategories/:id', adminController.getUpdateSubcategory);

router.post('/subcategories/:id', categoryImageUploadMiddleware, adminController.updateSubcategory);

router.delete('/subcategories/:id', adminController.deleteSubcategory);

router.get('/promo', adminController.getPromo);

module.exports = router;