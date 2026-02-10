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
                email: userInfo.email,
                isBlocked: userInfo.isBlocked,
                authProvider: userInfo.authProvider,
                subscription: userInfo.subscription,
                subscriptionPlan: userInfo.subscriptionPlan,
            }
        };

        const options = { upsert: true };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    });

    // get user by email for role
    app.get('/users/:email', verifyToken, async (req, res) => {
        const userEmail = req.params.email;
        const decodedEmail = req.decoded.email;
        if (userEmail !== decodedEmail) {
            return res.status(403).send({ message: "Forbidden access" });
        }

        const result = await usersCollection.findOne({ email: userEmail });
        res.send(result);
    });




    // products related all api's here

    // get all the products
    app.get('/products', async (req, res) => {
        const result = await productsCollection.find().toArray();
        res.send(result);
    })
    // featured products get
    app.get('/products/featured', async (req, res) => {
        const filter = { featured: true, status: "accepted" };
        const result = await productsCollection.find(filter).sort({ createdAt: -1 }).limit(4).toArray();
        res.send(result);
    })

    // Add new product to the database
    app.post('/products', verifyToken, async (req, res) => {
        try {
            const productData = req.body;
            const userEmail = req.decoded.email;
            const filter = { email: userEmail };
            const user = await usersCollection.findOne(filter);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            if (!user.subscription) {
                const count = await productsCollection.countDocuments({ ownerEmail: userEmail });
                if (count >= 1) {
                    return res.status(403).send({ message: "Free users can add only 1 product. Please subscribe" });
                }
            }
            const result = await productsCollection.insertOne(productData);
            res.send(result);
        }
        catch (error) {
            res.status(500).send({ message: 'Failed to add product' });
        };
    });

    // user based product
    app.get('/products/:email', async (req, res) => {
        const email = req.params.email;
        const filter = { ownerEmail: email };
        const result = await productsCollection.find(filter).toArray();
        res.send(result);
    })



    // review related all api's here


};

module.exports = { setUpAPI };