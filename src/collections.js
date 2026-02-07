
const { getDB } = require('./db');

const getCollections = () => {
    const db = getDB();

    // all the collections
    const usersCollection = db.collection('users');
    const productsCollection = db.collection('products');

    return {
        usersCollection,
        productsCollection,
    };
};

module.exports = { getCollections };