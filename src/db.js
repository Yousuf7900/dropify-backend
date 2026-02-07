require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

// checking for environment variables availability
if (!DATABASE_NAME || !DATABASE_USERNAME || !DATABASE_PASSWORD) {
    throw new Error("MongoDB environment variables are missing");
}

const uri = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@sufx-cluster.wgtvrlq.mongodb.net/?retryWrites=true&w=majority`;

let db;
const databaseName = DATABASE_NAME;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Here DB will connect only once
const connectDB = async () => {
    await client.connect();
    db = client.db(databaseName);
    console.log(`MongoDB connected to database: ${databaseName}`);
}

// Reuseable DB for other components
const getDB = () => {
    if (!db) {
        throw new Error("Database not connected yet!");
    }
    return db;
}

module.exports = { connectDB, getDB, client };