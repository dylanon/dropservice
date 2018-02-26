const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const encrypt = require('../utils/encrypt');
const decrypt = require('../utils/decrypt');

module.exports = function(app, collection) {
    // Apply middleware
    app.use(bodyParser.json());

    // Define routes
    app.get('/', (req, res) => {
        res.status(200).send('Rooting for you!');
    });

    app.get('/retrieve/:id', (req, res) => {
        // Validate the id
        // ObjectID requires a string of 24 hex characters
        if (req.params.id.length !== 24) {
            return res.status(400).send({
                deletedId: null,
                message: null,
                details: 'Invalid request. id must be a string of 24 hex characters.'
            });
        }
        // Find document with matching id in database, and store its message locally
        // Delete the document
        collection.findOneAndDelete({
            _id: new ObjectID(req.params.id)
        })
        .then(data => {
            const decryptedMessage = decrypt(data.value.message);
            // Send the stored message
            res.status(200).send({
                deletedId: data.value._id,
                message: decryptedMessage,
                details: `Deleted document with id ${data.value._id}.`
            });
        })
        .catch(error => {
            // findOneAndDelete throws an error if the id is not found
            // Handle it!
            res.status(404).send({
                deletedId: null,
                message: null,
                details: `Could not find document with id ${req.params.id}. Nothing deleted.`
            });
        });
    });

    app.post('/drop', (req, res) => {
        if (req.body.message) {
            const encryptedMessage = encrypt(req.body.message);
            collection.insertOne({
                message: encryptedMessage,
                timeCreated: Date.now()
            })
            .then(result => {
                const reply = {
                    writeSucceeded: true,
                    details: 'Write to database succeeded!',
                    id: result.insertedId
                }
                res.status(201).send(reply);
            })
            .catch(error => {
                const reply = {
                    writeSucceeded: false,
                    details: 'Failed to write to database.',
                    id: undefined
                }
                res.status(500).send(reply);
            });
        } else {
            const reply = {
                writeSucceeded: false,
                details: "Invalid request - Define the 'message' property in your request!",
                id: undefined
            }
            res.status(400).send(reply);
        }
    });
}