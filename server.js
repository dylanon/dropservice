const app = require('./app');
const env = require('./env');

// Set port
const PORT = process.env.PORT || env.PORT;

// Listen for requests
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});