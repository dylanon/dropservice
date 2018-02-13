const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const encrypt = require('../utils/encrypt');
const decrypt = require('../utils/decrypt');

module.exports = function(app, collection) {
    // Apply middleware
    app.use(bodyParser.json());

    // Define routes
    app.get('/', (req, res) => {
        res.send('Rooting for you!');
    });

    app.get('/read/:id', (req, res) => {
        // Validate the id
        // ObjectID requires a string of 24 hex characters
        if (req.params.id.length !== 24) {
            return res.send({
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
            res.send({
                deletedId: data.value._id,
                message: decryptedMessage,
                details: `Deleted document with id ${data.value._id}.`
            });
        })
        .catch(error => {
            // findOneAndDelete throws an error if the id is not found
            // Handle it!
            res.send({
                deletedId: null,
                message: null,
                details: `Could not find document with id ${req.params.id}. Nothing deleted.`
            });
        });
    });

    app.post('/write', (req, res) => {
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
}