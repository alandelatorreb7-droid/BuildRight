const fs = require('fs');
const path = require('path');
const { pool } = require('./index');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function setup() {
  const client = await pool.connect();
  try {
    // Always run schema — CREATE TABLE IF NOT EXISTS makes this safe to re-run
    console.log('Ensuring database schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);
    console.log('Schema ready.');

    // Only seed if the database is empty ��� prevents wiping data on every deploy
    const { rows } = await client.query('SELECT COUNT(*) AS count FROM categories');
    if (parseInt(rows[0].count) === 0) {
      console.log('Empty database — seeding catalog data...');
      const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
      await client.query(seed);
      console.log('Catalog seeded successfully.');
    } else {
      console.log(`Database already contains ${rows[0].count} categories — skipping seed.`);
    }

    console.log('BuildRight database ready.');
  } catch (err) {
    console.error('Database setup failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
