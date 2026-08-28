/**
 * NLAMS MongoDB Atlas Database Connector & Sync Service
 * Department of Land Resources (DoLR) • Ministry of Rural Development
 */

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb+srv://guptakundan63519_db_user:ryRs1I3rH6zy92XL@cluster0.elqd4oq.mongodb.net/nlams?retryWrites=true&w=majority&appName=Cluster0";

let client = null;
let db = null;
let isConnected = false;

async function connectMongoDB() {
  if (isConnected && db) return db;
  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });

    await client.connect();
    db = client.db("nlams");
    isConnected = true;
    console.log("🍃 Successfully connected to MongoDB Atlas Cloud Database (nlams)!");
    return db;
  } catch (err) {
    console.warn("⚠️ MongoDB Atlas connection notice (using SQLite primary):", err.message);
    isConnected = false;
    return null;
  }
}

async function syncToMongo(collectionName, document, filter = { id: document.id }) {
  try {
    const database = await connectMongoDB();
    if (!database) return false;
    const collection = database.collection(collectionName);
    await collection.updateOne(filter, { $set: document }, { upsert: true });
    return true;
  } catch (err) {
    console.warn(`MongoDB sync failed for ${collectionName}:`, err.message);
    return false;
  }
}

module.exports = {
  connectMongoDB,
  syncToMongo,
  isMongoConnected: () => isConnected
};
