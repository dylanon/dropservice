const crypto = require('crypto');
const env = require('../env');
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || env.ENCRYPTION_SECRET;

module.exports = function(encryptedText) {
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_SECRET);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted = decrypted + decipher.final('utf-8');
    return decrypted;
}