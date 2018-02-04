// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb');

// Import routes
const defineRoutes = require('./routes');

// Initialize the app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Apply middleware
app.use(bodyParser.urlencoded({
    extended: true
}));

// Set database credentials
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME;

MongoClient.connect(MONGODB_URI, (error, client) => {
    if (error) {
        return console.log(error);
    }
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

    // Listen for requests
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
})