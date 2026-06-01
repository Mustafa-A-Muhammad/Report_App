const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Client } = require('pg');

(async () => {
  const sqlPath = path.join(__dirname, '..', 'db', 'init.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('Migration file not found:', sqlPath);
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not set in environment or .env file. Create Backend/.env or set env var.');
    process.exit(1);
  }
  const client = new Client({ connectionString });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Migration applied successfully.');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    try { await client.end(); } catch {}
    process.exit(1);
  }
})();
