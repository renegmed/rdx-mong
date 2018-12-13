require('dotenv').config();

module.exports = {
    mongoURI: process.env.DATABASE_CONFIG,
    secret: process.env.SECRET     
};
