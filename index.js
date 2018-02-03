// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb');

// Initialize the app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Apply middleware
app.use(bodyParser.urlencoded({
    extended: true
}));

// Listen for requests
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Set database credentials
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME;

MongoClient.connect(MONGODB_URI, (error, client) => {
    if (error) {
        return console.log(error);
    }
    console.log('Connected to MongoDB');
    const db = client.db(MONGODB_NAME);

    // Enable CORS
    // (See https://enable-cors.org/server_expressjs.html)
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // Define routes
    app.get('/', (req, res) => {
        res.send('Rooting for you!');
    });
    app.get('/read/:id', (req, res) => {
        res.send(`Received GET request for ${req.params.id}`);
    });
    app.post('/write', (req, res) => {
        // console.log(req.body);
        const message = req.body;
        // res.send('Received POST request to create drop.');
        res.send(message);
    });
})