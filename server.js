// Set environment variables for local development without Heroku CLI
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const app = require('./app');

// Set port
const PORT = process.env.PORT;

// Listen for requests
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})