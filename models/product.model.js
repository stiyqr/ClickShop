const mongodb = require('mongodb');

const db = require('../data/database');
const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.category = productData.category;
        this.subcategory = productData.subcategory;
        // this.getCategoryNames();
        this.summary = productData.summary;
        this.originalPrice = +productData.originalPrice;
        this.description = productData.description;
        this.image = productData.image; // the name of the image file
        this.updateImageData();
        if (productData._id) {
            this.id = productData._id.toString();
        }
        if (productData.hasPromo === true || productData.hasPromo === 'true') {
            this.hasPromo = true;
        }
        else {
            this.hasPromo = false;
        }
        if (this.hasPromo) {
            this.promoPrice = +productData.promoPrice;
            this.price = this.promoPrice;
        }
        else {
            this.price = this.originalPrice;
        }
    }

    static async findById(productId) {
        let prodId;
        try {
            prodId = new mongodb.ObjectId(productId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const product = await db
            .getDb()
            .collection('products')
            .findOne({ _id: prodId });

        if (!product) {
            const error = new Error('Could not find product with provided id.');
            error.code = 404;
            throw error;
        }

        return new Product(product);
    }

    static async findAll() {
        const products = await db
            .getDb()
            .collection('products')
            .find()
            .toArray();

        // transform the documents fetched from mongodb to Product class (to rebuild imagePath and imageUrl)
        return products.map(function (productDocument) {
            return new Product(productDocument);
        });
    }

    static async findMultiple(ids) {
        const productIds = ids.map(function (id) {
            return new mongodb.ObjectId(id);
        });

        const products = await db
            .getDb()
            .collection('products')
            .find({ _id: { $in: productIds } }) // $in -> the _id is one of the ids specified in the productIds array
            .toArray();

        return products.map(function (productDocument) {
            return new Product(productDocument);
        });
    }

    static async findBySubcategory(subcategoryId) {
        const products = await db
            .getDb()
            .collection('products')
            .find({ subcategory: subcategoryId })
            .toArray();

        if (!products) {
            const error = new Error('Could not find product with provided subcategory id.');
            error.code = 404;
            throw error;
        }

        return products.map(function (productDocument) {
            return new Product(productDocument);
        });
    }

    static async findAllPromo() {
        const products = await db
            .getDb()
            .collection('products')
            .find({ hasPromo: true })
            .toArray();

        return products.map(function (productDocument) {
            return new Product(productDocument);
        });
    }

    async getCategoryNames() {
        if (this.category) {
            const cat = await Category.findById(this.category);
            this.categoryName = cat.title;
        }
        else {
            this.categoryName = 'none';
        }

        if (this.subcategory) {
            const subCat = await Subcategory.findById(this.subcategory);
            this.subcategoryName = subCat.title;
        }
        else {
            this.subcategoryName = 'none';
        }
    }

    updateImageData() {
        this.imagePath = `product-data/images/${this.image}`;
        this.imageUrl = `/products/assets/images/${this.image}`;
    }

    async save() {
        const productData = {
            title: this.title,
            category: this.category,
            subcategory: this.subcategory,
            summary: this.summary,
            originalPrice: this.originalPrice,
            price: this.price,
            description: this.description,
            image: this.image,
            hasPromo: this.hasPromo,
            promoPrice: this.promoPrice
        };

        if (this.id) {
            // update existing product
            const productId = new mongodb.ObjectId(this.id);

            if (!this.image) {
                delete productData.image; // deletes the 'image' key-value pair from the productData object
            }

            if (!this.promoPrice) {
                delete productData.promoPrice;
            }

            await db.getDb().collection('products').updateOne(
                { _id: productId },
                {
                    $set: productData,
                }
            );
        } else {
            await db.getDb().collection('products').insertOne(productData);
        }
    }

    replaceImage(newImage) {
        this.image = newImage;
        this.updateImageData();
    }

    remove() {
        const productId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('products').deleteOne({ _id: productId }); // returns a promise
    }
}

module.exports = Product;
