const fs = require('fs');
const path = require('path');
const { pool } = require('./index');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function setup() {
  const client = await pool.connect();
  try {
    console.log('Creating database schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);
    console.log('Schema created.');

    console.log('Seeding data...');
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await client.query(seed);
    console.log('Seed data inserted.');

    console.log('\nBuildRight database ready!');
  } catch (err) {
    console.error('Setup failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
