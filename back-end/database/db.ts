import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Prefer a single connection string when available (e.g., Neon)
const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

let pool: Pool;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 60000,
    idleTimeoutMillis: 30000,
    max: 20,
  });
} else {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 60000,
    idleTimeoutMillis: 30000,
    max: 20,
  });
}

export default pool;