const mongoose = require('mongoose');
let { MONGODB_URI, DB_USER, NODE_ENV} = process.env;

/**
 * This kicks off the database on an auto start.
 */

// Create MongoDB connection
if (MONGODB_URI) {
    const options = { useMongoClient: true };
    mongoose.connect(MONGODB_URI, options);

} else if (NODE_ENV === 'dev' || DB_USER === undefined) {
    let { DB_DEV_HOST, DB_DEV_ENDPOINT } = process.env;

    // If not declared fall back to localhost
    DB_DEV_HOST = DB_DEV_HOST || 'localhost';

    const uri = `mongodb://${DB_DEV_HOST}/${DB_DEV_ENDPOINT}`
    const options = { useMongoClient: true };
    mongoose.connect(uri, options);

} else {
    let { DB_PROD_HOST, DB_PROD_USER, DB_PROD_PASS, DB_DEV_ENDPOINT } = process.env;
    const uri = `mongodb://${DB_PROD_USER}:${DB_PROD_PASS}@${DB_PROD_HOST}/#{DB_PROD_ENDPOINT}`
    const options = { auth: { authdb: "admin" }, useMongoClient: true };
    mongoose.connect(uri, options);
}

// Test DB is called on the spot in test code.

// Can write error trapping here if the DB user isn't set for production. Mongo will complain so its not major.
