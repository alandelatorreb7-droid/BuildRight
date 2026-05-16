const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/items?category=slug
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query, params;

    if (category) {
      query = `
        SELECT i.*, c.name AS category_name, c.slug AS category_slug
        FROM items i
        JOIN categories c ON i.category_id = c.id
        WHERE c.slug = $1 AND i.is_active = TRUE
        ORDER BY i.sort_order, i.name
      `;
      params = [category];
    } else {
      query = `
        SELECT i.*, c.name AS category_name, c.slug AS category_slug
        FROM items i
        JOIN categories c ON i.category_id = c.id
        WHERE i.is_active = TRUE
        ORDER BY c.sort_order, i.sort_order, i.name
      `;
      params = [];
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
