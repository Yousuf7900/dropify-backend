const jwt = require('jsonwebtoken');
const { getCollections } = require('./collections');
const verifyToken = require('./middlewares/verifyToken');

const setUpAPI = (app) => {
    const { usersCollection, productsCollection } = getCollections();

    // test api
    app.get('/api/test', (req, res) => {
        res.send("Test Api is Running");
    })

    // API's Start From Here

    // JWT related api's here
    app.post('/jwt', async (req, res) => {
        const userInfo = req.body;
        const token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h', issuer: "Dropify" });
        res.send({ token });
    })


    // users related all api's here
    app.patch('/users', async (req, res) => {
        const userInfo = req.body;

        if (!userInfo?.email || !userInfo?.uid) {
            return res.status(400).send({ message: "email and uid are required" });
        }

        const filter = { email: userInfo.email };

        const updateDoc = {
            $set: {
                name: userInfo.name,
                photoURL: userInfo.photoURL,
                lastLoginAt: userInfo.lastLoginAt,
                uid: userInfo.uid
            },
            $setOnInsert: {
                role: userInfo.role || 'user',
                createdAt: userInfo.createdAt,
                email: userInfo.email
            }
        };

        const options = { upsert: true };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    });




    // products related all api's here

    // get all the products
    app.get('/products', async (req, res) => {
        const result = await productsCollection.find().toArray();
        res.send(result);
    })

    // Add new product to the database
    app.post('/products', verifyToken, async (req, res) => {
        const productData = req.body;
        const result = await productsCollection.insertOne(productData);
        res.send(result);
    })




    // review related all api's here




};

module.exports = { setUpAPI };