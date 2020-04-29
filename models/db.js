const mongoose = require('mongoose');
let { MONGODB_URI, DB_HOST, DB_USER, DB_PASS, NODE_ENV } = process.env;

// If not declared fall back to localhost
DB_HOST = DB_HOST || 'localhost';

// Create MongoDB connection
if (MONGODB_URI) {
    const options = { useMongoClient: true };
    mongoose.connect(MONGODB_URI, options);

} else if (NODE_ENV === 'dev' || DB_USER === undefined) {
    const uri = `mongodb://${DB_HOST}/test`
    const options = { useMongoClient: true };
    mongoose.connect(uri, options);

} else {
    const uri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/URT-DB`
    const options = { auth: { authdb: "admin" }, useMongoClient: true };
    mongoose.connect(uri, options);
}