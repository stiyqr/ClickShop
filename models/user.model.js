const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');

class User {
    constructor(username, password, phone, street, city) {
        this.username = username;
        this.password = password;
        this.phone = phone;
        // this.address = {
        //     street: street,
        //     city: city,
        // };
    }

    static findById(userId) {
        const uid = mongodb.ObjectId.createFromHexString(userId);

        return db
            .getDb()
            .collection('users')
            .findOne({ _id: uid }, { projection: { password: 0 } });
    }

    // getUserWithSameEmail() {
    //     return db.getDb().collection('users').findOne({ email: this.email }); // will return a promise even without 'await' keyword, because of 'return'
    // }

    getUserWithSameUsername() {
        return db.getDb().collection('users').findOne({ username: this.username }); // returns a promise
    }

    async existAlready() {
        const existingUser = await this.getUserWithSameUsername();
        if (existingUser) {
            return true;
        }
        return false;
    }

    async signup() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        db.getDb().collection('users').insertOne({
            username: this.username,
            password: hashedPassword,
            phone: this.phone,
            // address: this.address,
        });
    }

    hasMatchingPassword(hashedPassword) {
        return bcrypt.compare(this.password, hashedPassword); // returns a promise
    }
}

module.exports = User;
