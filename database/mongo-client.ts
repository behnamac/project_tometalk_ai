import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable');

declare global {
    var nativeMongoClient: MongoClient | undefined
}

// Separate from database/mongoose.ts: Better Auth's MongoDB adapter needs a raw
// mongodb driver Db/MongoClient, not a Mongoose connection.
const mongoClient = global.nativeMongoClient ?? (global.nativeMongoClient = new MongoClient(MONGODB_URI));

export const mongoDb = mongoClient.db();
export default mongoClient;
