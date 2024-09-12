const mongodb = require('mongodb');

const db = require('../data/database');

class Category {
    constructor(categoryData) {
        this.title = categoryData.title;
        this.image = categoryData.image; // the name of the image file
        this.updateImageData();
        if (categoryData._id) {
            this.id = categoryData._id.toString();
        }
        if (categoryData.isPulsa) {
            this.isPulsa = categoryData.isPulsa;
        }
        // if (categoryData.promo) {
        //     this.promo = categoryData.promo;
        // }
    }

    static async findAll() {
        const categories = await db
            .getDb()
            .collection('categories')
            .find()
            .toArray();

        // transform the documents fetched from mongodb to Product class (to rebuild imagePath and imageUrl)
        return categories.map(function (categoryDocument) {
            return new Category(categoryDocument);
        });
    }

    static async findById(categoryId) {
        let catId;
        try {
            catId = new mongodb.ObjectId(categoryId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const category = await db
            .getDb()
            .collection('categories')
            .findOne({ _id: catId });

        if (!category) {
            const error = new Error('Could not find product with provided id.');
            error.code = 404;
            throw error;
        }
        
        return new Category(category);
    }

    updateImageData() {
        this.imagePath = `product-data/categories/${this.image}`;
        this.imageUrl = `/products/assets/categories/${this.image}`;
    }

    async save() {
        const categoryData = {
            title: this.title,
            image: this.image,
            // promo: this.promo,
        };

        if (this.id) {
            // update existing product
            const categoryId = new mongodb.ObjectId(this.id);

            if (!this.image) {
                delete categoryData.image; // deletes the 'image' key-value pair from the productData object
            }

            await db.getDb().collection('categories').updateOne(
                { _id: categoryId },
                {
                    $set: categoryData,
                }
            );
        } else {
            await db.getDb().collection('categories').insertOne(categoryData);
        }
    }

    replaceImage(newImage) {
        this.image = newImage;
        this.updateImageData();
    }

    remove() {
        const categoryId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('categories').deleteOne({ _id: categoryId }); // returns a promise
    }
}

module.exports = Category;
