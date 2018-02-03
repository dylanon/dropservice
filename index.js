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
    const collection = db.collection('drops');

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
        if (req.body.message) {
            collection.insertOne({
                message: req.body.message
            })
            .then(result => {
                const reply = {
                    writeSucceeded: true,
                    details: 'Write to database succeeded!',
                    id: result.insertedId
                }
                res.send(reply);
            })
            .catch(error => {
                const reply = {
                    writeSucceeded: false,
                    details: 'Failed to write to database.',
                    id: undefined
                }
                res.send(reply);
            });
        } else {
            const reply = {
                writeSucceeded: false,
                details: "Invalid request - Define the 'message' property in your request!",
                id: undefined
            }
            res.send(reply);
        }
    });
})