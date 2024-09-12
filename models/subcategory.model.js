const mongodb = require('mongodb');

const db = require('../data/database');

class Subcategory {
    constructor(subcategoryData) {
        this.title = subcategoryData.title;
        this.parentCategory = subcategoryData.parentCategory;
        this.image = subcategoryData.image; // the name of the image file
        this.updateImageData();
        if (subcategoryData._id) {
            this.id = subcategoryData._id.toString();
        }
        // if (subcategoryData.promo) {
        //     this.promo = subcategoryData.promo;
        // }
    }

    static async findAll() {
        const subcategories = await db
            .getDb()
            .collection('subcategories')
            .find()
            .toArray();

        // transform the documents fetched from mongodb to Product class (to rebuild imagePath and imageUrl)
        return subcategories.map(function (subcategoryDocument) {
            return new Subcategory(subcategoryDocument);
        });
    }

    static async findByParent(parentId) {
        const subcategories = await db
            .getDb()
            .collection('subcategories')
            .find({ parentCategory: parentId })
            .toArray();

        // transform the documents fetched from mongodb to Product class (to rebuild imagePath and imageUrl)
        return subcategories.map(function (subcategoryDocument) {
            return new Subcategory(subcategoryDocument);
        });
    }
    
    static async findById(subcategoryId) {
        let subcatId;
        try {
            subcatId = new mongodb.ObjectId(subcategoryId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const subcategory = await db
            .getDb()
            .collection('subcategories')
            .findOne({ _id: subcatId });

        if (!subcategory) {
            const error = new Error('Could not find product with provided id.');
            console.log(subcatId);
            error.code = 404;
            throw error;
        }

        return new Subcategory(subcategory);
    }

    updateImageData() {
        this.imagePath = `product-data/categories/${this.image}`;
        this.imageUrl = `/products/assets/categories/${this.image}`;
    }

    async save() {
        const subcategoryData = {
            title: this.title,
            parentCategory: this.parentCategory,
            image: this.image,
            // promo: this.promo,
        };

        if (this.id) {
            // update existing product
            const subcategoryId = new mongodb.ObjectId(this.id);

            if (!this.image) {
                delete subcategoryData.image; // deletes the 'image' key-value pair from the productData object
            }

            await db.getDb().collection('subcategories').updateOne(
                { _id: subcategoryId },
                {
                    $set: subcategoryData,
                }
            );
        } else {
            await db.getDb().collection('subcategories').insertOne(subcategoryData);
        }
    }

    replaceImage(newImage) {
        this.image = newImage;
        this.updateImageData();
    }

    remove() {
        const subcategoryId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('subcategories').deleteOne({ _id: subcategoryId }); // returns a promise
    }
}

module.exports = Subcategory;
