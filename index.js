// Import dependencies
const express = require('express');

// Initialize the app
const app = express();

// Set port
const port = process.env.PORT || 5000;

// Listen for requests
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Define routes
app.get('/', (req, res) => {
    res.send('Rooting for you!');
});

app.get('/read/:id', (req, res) => {
    res.send(`Received GET request for ${req.params.id}`);
});

app.post('/write', (req, res) => {
    res.send('Received POST request to create drop.');
});