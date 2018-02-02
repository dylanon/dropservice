// Import dependencies
const express = require('express');

// Initialize the app
const app = express();

// Define port
const port = 8080;

// Listen for requests
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Define routes
app.get('/read/:id', (req, res) => {
    res.send(`Received GET request for ${req.params.id}`);
});

app.post('/write', (req, res) => {
    res.send('Received POST request to create drop.');
});