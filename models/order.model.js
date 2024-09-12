const mongodb = require('mongodb');

const db = require('../data/database');

class Order {
    // Status => pending, completed, canceled
    constructor(cart, userData, status = 'pending', date, orderId) {
        this.productData = cart;
        this.userData = userData;
        this.status = status;
        this.date = new Date(date);
        // can omit this if(this.date) check, because if the given date is empty, new Date() will yield 'invalid date'
        // but will still support Date utility methods, so will not cause error
        if (this.date) {
            this.formattedDate = this.date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        }
        this.id = orderId;
    }

    static transformOrderDocument(orderDoc) {
        return new Order(
            orderDoc.productData,
            orderDoc.userData,
            orderDoc.status,
            orderDoc.date,
            orderDoc._id
        );
    }

    static transformOrderDocuments(orderDocs) {
        return orderDocs.map(this.transformOrderDocument);
    }

    static async findAll() {
        const orders = await db
            .getDb()
            .collection('orders')
            .find()
            .sort({ _id: -1 }) // sort in descending order (mongodb _id has timestamp)
            .toArray();

        return this.transformOrderDocuments(orders);
    }

    static async findAllForUser(userId) {
        const uid = new mongodb.ObjectId(userId);

        const orders = await db
            .getDb()
            .collection('orders')
            .find({ 'userData._id': uid })
            .sort({ _id: -1 })
            .toArray();

        return this.transformOrderDocuments(orders);
    }

    static async findById(orderId) {
        const order = await db
            .getDb()
            .collection('orders')
            .findOne({ _id: new mongodb.ObjectId(orderId) });


        return this.transformOrderDocument(order);
    }

    save() {
        // check if updating an existing order, or storing a new order
        if (this.id) {
            // updating
            const orderId = new mongodb.ObjectId(this.id);
            return db
                .getDb()
                .collection('orders')
                .updateOne({ _id: orderId }, { $set: { status: this.status } });
        } else {
            // storing new order
            const orderDocument = {
                userData: this.userData,
                productData: this.productData,
                date: new Date(),
                status: this.status,
            };

            return db.getDb().collection('orders').insertOne(orderDocument);
        }
    }
}

module.exports = Order;
