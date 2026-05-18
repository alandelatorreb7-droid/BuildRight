const express = require('express');
const router = express.Router();
const db = require('../db');
const adminAuth = require('../middleware/auth');

// Verify admin password
router.post('/verify', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// GET all items (including inactive)
router.get('/items', adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.*, c.name AS category_name, c.slug AS category_slug
      FROM items i
      JOIN categories c ON i.category_id = c.id
      ORDER BY c.sort_order, i.sort_order, i.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST create item
router.post('/items', adminAuth, async (req, res) => {
  const { category_id, name, description, unit, unit_price, item_type, sort_order, price_updated_at } = req.body;
  if (!category_id || !name || !unit || unit_price == null || !item_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await db.query(
      `INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order, price_updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [category_id, name, description || null, unit, unit_price, item_type, sort_order || 0, price_updated_at || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update item
router.put('/items/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { category_id, name, description, unit, unit_price, item_type, is_active, sort_order, price_updated_at } = req.body;
  try {
    const result = await db.query(
      `UPDATE items
       SET category_id = COALESCE($1, category_id),
           name = COALESCE($2, name),
           description = $3,
           unit = COALESCE($4, unit),
           unit_price = COALESCE($5, unit_price),
           item_type = COALESCE($6, item_type),
           is_active = COALESCE($7, is_active),
           sort_order = COALESCE($8, sort_order),
           price_updated_at = COALESCE($9, price_updated_at),
           updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [category_id, name, description, unit, unit_price, item_type, is_active, sort_order, price_updated_at || null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE item
router.delete('/items/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM items WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET all categories (for admin dropdowns)
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY sort_order, name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
