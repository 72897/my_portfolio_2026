import mongoose from "mongoose";

/** Thrown when the database is not configured or cannot be reached. */
export class DbUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "DbUnavailableError";
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailure: number;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  globalThis.mongooseCache ?? { conn: null, promise: null, lastFailure: 0 };
globalThis.mongooseCache = cached;

const SERVER_SELECTION_TIMEOUT_MS = 5000;
// After a failed connection, fail fast for a while instead of making every
// request wait for another server-selection timeout.
const RETRY_AFTER_MS = 30_000;

export function isDbConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    if (mongoose.connection.readyState === 1) return cached.conn;
    if (mongoose.connection.readyState === 0) {
      // The connection dropped; start a fresh one.
      cached.conn = null;
      cached.promise = null;
    }
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new DbUnavailableError("MONGODB_URI is not set");
  }

  if (!cached.promise) {
    if (Date.now() - cached.lastFailure < RETRY_AFTER_MS) {
      throw new DbUnavailableError("Database connection failed recently; retrying shortly");
    }
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
      connectTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    cached.lastFailure = Date.now();
    throw new DbUnavailableError("Could not connect to the database", { cause: error });
  }

  return cached.conn;
}

export default dbConnect;
