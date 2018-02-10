const crypto = require('crypto');
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;

module.exports = function(text) {
    const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_SECRET);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted = encrypted + cipher.final('hex');
    return encrypted;
}