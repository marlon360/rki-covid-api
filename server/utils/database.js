const { MongoClient } = require('mongodb');

// get database credentials from environment
const dbuser = process.env['DATABASE_USER'];
const dbpassword = process.env['DATABASE_PASSWORD'];
const dbname = process.env['DATABASE_NAME'];

// construct mongodb url
const uri = `mongodb+srv://${dbuser}:${dbpassword}@cluster0.w244q.mongodb.net/${dbname}?retryWrites=true&w=majority`;

async function connectToDatabase() {
    // connect to mongodb
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbname);
    return db;
}

module.exports.connectToDatabase = connectToDatabase;