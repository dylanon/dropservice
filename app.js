// Import dependencies
const express = require('express');
const MongoClient = require('mongodb');

// Import routes
const defineRoutes = require('./routes');

// Initialize the app
const app = express();

// Set database credentials
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME;

MongoClient.connect(MONGODB_URI)
.then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(MONGODB_NAME);
    const collection = db.collection('drops');
    // Enable CORS
    // (See https://enable-cors.org/server_expressjs.html)
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    defineRoutes(app, collection);
})
.catch(error => {
    console.log(error);
});

module.exports = app;