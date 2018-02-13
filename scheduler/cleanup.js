// Set environment variables for local development without Heroku CLI
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

// Import dependencies
const MongoClient = require('mongodb');

// Set database credentials
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME;

// Make this variable accessible in global scope
let collection;

// Connect to database
MongoClient.connect(MONGODB_URI)
.then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(MONGODB_NAME);
    collection = db.collection('drops');
})
.then(() => {
    collection.deleteMany({
        timeCreated: {
            // Target drops older than a day
            $lt: Date.now() - 24 * 60 * 60 * 1000
        }
    })
    .then(result => {
        console.log(`Deleted ${result.result.n} expired drops.`);
        process.exit();
    })
    .catch(error => {
        console.log(error);
        process.exit();
    });
})
.catch(error => {
    console.log(error);
    process.exit();
});