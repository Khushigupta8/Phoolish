import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { databaseUrl } from "@/lib/env";

function connect() {
  const url = databaseUrl();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Postgres store to the Vercel project (Storage -> Neon), which sets it automatically, then redeploy."
    );
  }
  // Neon's HTTP driver holds no socket, so one instance is safe to reuse across
  // the invocations a warm serverless function serves.
  return drizzle(neon(url), { schema });
}

let db: ReturnType<typeof connect> | null = null;

export function getDb() {
  return (db ??= connect());
}
