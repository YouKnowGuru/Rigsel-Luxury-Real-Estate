import mongoose from "mongoose";
import { Resolver } from "dns/promises";

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  resolvedUri: string | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: Cached | undefined;
}

const cached: Cached =
  global.mongoose || { conn: null, promise: null, resolvedUri: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Many ISP / Windows DNS resolvers refuse SRV record lookups with
 * `ECONNREFUSED`, which breaks `mongodb+srv://` connection strings entirely.
 *
 * To work around this, when we receive an `mongodb+srv://` URI we resolve
 * the SRV + TXT records ourselves against public DNS servers (Cloudflare /
 * Google) and rewrite the URI to the equivalent standard `mongodb://` form.
 * The MongoDB driver then connects without ever touching the local resolver.
 *
 * If manual resolution fails after a timeout, we fall back to letting
 * mongoose handle the connection with the original URI.
 */
async function resolveMongoUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  const url = new URL(uri);
  const host = url.hostname;

  const resolver = new Resolver();
  resolver.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);

  let srvRecords: { name: string; port: number }[] = [];
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DNS resolution timed out")), 5000)
    );
    srvRecords = await Promise.race([
      resolver.resolveSrv(`_mongodb._tcp.${host}`),
      timeoutPromise,
    ]);
  } catch (e) {
    console.error("MongoDB SRV resolution failed, falling back to original URI:", e);
    return uri;
  }

  if (!srvRecords.length) {
    return uri;
  }

  let txtParams = "";
  try {
    const txtRecords = await resolver.resolveTxt(host);
    txtParams = txtRecords.map((parts) => parts.join("")).join("&");
  } catch {
    // TXT is optional; Atlas usually has one but missing is recoverable.
  }

  const userInfo =
    url.username || url.password
      ? `${url.username}${url.password ? `:${url.password}` : ""}@`
      : "";

  const hostList = srvRecords
    .map((r) => `${r.name}:${r.port}`)
    .join(",");

  const existingQuery = url.search ? url.search.slice(1) : "";
  const mergedQuery = [
    "ssl=true",
    txtParams,
    existingQuery,
  ]
    .filter(Boolean)
    .join("&");

  const dbPath = url.pathname && url.pathname !== "/" ? url.pathname : "/";

  return `mongodb://${userInfo}${hostList}${dbPath}?${mergedQuery}`;
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4 as const,
    };

    cached.promise = (async () => {
      const uri = cached.resolvedUri ?? (await resolveMongoUri(MONGODB_URI));
      cached.resolvedUri = uri;
      const m = await mongoose.connect(uri, opts);
      return m;
    })().catch((err) => {
      console.error(
        "✗ MongoDB connection failed:",
        err?.code || err?.name || "unknown",
        "-",
        err?.message || err
      );
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
