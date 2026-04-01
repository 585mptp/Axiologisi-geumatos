
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Please add Mongo URI to .env");
}

const uri = process.env.MONGODB_URI;
const options = { maxPoolSize: 10 }; //Connection pooling to reuse coonnections

let client;
let clientPromise;

// In production, only create a single instance
client = new MongoClient(uri, options);
clientPromise = client.connect();


export default clientPromise;
