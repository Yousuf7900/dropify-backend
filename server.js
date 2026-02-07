require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectDB } = require('./src/db');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes



// server start
const startServer = async (req, res) => {
    try {
        // connect database first
        await connectDB();

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