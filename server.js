require('dotenv').config();
const express = require('express');
const cors = require('cors');

// importing third party files
const { connectDB } = require('./src/db');
const { setUpAPI } = require('./src/api');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors(
    {
        origin: [
            'https://dropify-shop.web.app',
            'http://localhost:5173'
        ]
    }
));

app.use(express.json());

// server start
const startServer = async () => {
    try {
        // connect database first
        await connectDB();
        setUpAPI(app);

        // now listen
        app.listen(PORT, () => {
            console.log(`Dropify server running on Port: ${PORT}`);
        });
    }
    catch (error) {
        console.log("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();