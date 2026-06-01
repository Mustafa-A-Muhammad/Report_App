import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('Warning: DATABASE_URL not set. Falling back to default local Postgres connection.');
}

const pool = new Pool({ connectionString });

export default pool;
