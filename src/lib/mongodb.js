import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn(
    "[bazardor] MONGODB_URI is not set. Authentication will not work until it is configured (see .env.example).",
  );
}

// Reuse one client across hot reloads in development and across invocations
// in serverless environments, so we never exhaust Atlas connections.
const globalForMongo = globalThis;

export const mongoClient =
  globalForMongo._bazardorMongoClient ??
  new MongoClient(uri || "mongodb://127.0.0.1:27017", { serverSelectionTimeoutMS: 8000 });

if (process.env.NODE_ENV !== "production") {
  globalForMongo._bazardorMongoClient = mongoClient;
}

export const db = mongoClient.db(process.env.MONGODB_DB || "bazardor");
