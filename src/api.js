
const { getCollections } = require('./collections');

const setUpAPI = (app) => {
    const { usersCollection, productsCollection } = getCollections();

    // test api
    app.get('/api/test', (req, res) => {
        res.send("API's are working");
    })

    
};

module.exports = { setUpAPI };