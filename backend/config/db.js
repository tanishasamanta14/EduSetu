const mongoose = require('mongoose');
const config = require('./env');
let MongoMemoryServer;
try {
  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
} catch (e) {}

let mongod = null;

const connectDB = async () => {
  try {
    let uri = config.mongoUri;
    
    // Automatically use in-memory server for local dev if uri is default localhost and memory server is available
    if (uri.includes('localhost') && MongoMemoryServer) {
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log('Using In-Memory MongoDB Server for Development');
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, disconnectDB };
