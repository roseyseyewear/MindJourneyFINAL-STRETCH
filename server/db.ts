import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { db as mockDb } from './db-mock.js';

neonConfig.webSocketConstructor = ws;

let db: any;
let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else {
  console.warn("⚠️  DATABASE_URL not set. Using mock database for development.");
  console.warn("💡 Set DATABASE_URL in Replit Secrets to use real database.");
  db = mockDb;
}

export { db, pool };