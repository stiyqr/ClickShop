const express = require('express');

const categoriesController = require('../controllers/categories.controller');

const router = express.Router();

router.get('/home', categoriesController.getHome);

router.get('/categories', categoriesController.getAllCategories);

router.get('/categories/:catId', categoriesController.getSubcategories);

router.get('/categories/:catId/sub/:subcatId', categoriesController.getProducts);

router.get('/promo', categoriesController.getPromo);

module.exports = router;