-- Migration 002: Add Beams & Posts items to Materials category
-- El Paso TX 2026 market prices — 2026-05-22

INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order, price_updated_at) VALUES
  ((SELECT id FROM categories WHERE slug = 'materials'), '4x4x8 Post Pressure Treated',    'PT 4x4x8 structural post, ground contact rated',         'ea',  19.00, 'materials', 56, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), '4x6x8 Beam Douglas Fir',         'Douglas fir 4x6x8 structural beam',                      'ea',  28.00, 'materials', 57, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), '4x8x12 Beam Douglas Fir',        'Douglas fir 4x8x12 structural beam',                     'ea',  52.00, 'materials', 58, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), '4x10x12 Beam Douglas Fir',       'Douglas fir 4x10x12 structural beam',                    'ea',  68.00, 'materials', 59, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), '4x12x12 Beam Douglas Fir',       'Douglas fir 4x12x12 structural beam',                    'ea',  85.00, 'materials', 60, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), '6x6x8 Post Pressure Treated',    'PT 6x6x8 heavy-duty structural post, ground contact',    'ea',  42.00, 'materials', 61, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), '6x8x12 Beam Douglas Fir',        'Douglas fir 6x8x12 heavy structural beam',               'ea',  95.00, 'materials', 62, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'LVL Beam 1.75x9.5x16ft',         'Laminated veneer lumber, 1.75" x 9.5" x 16ft',          'ea', 148.00, 'materials', 63, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'LVL Beam 1.75x11.25x16ft',       'Laminated veneer lumber, 1.75" x 11.25" x 16ft',        'ea', 185.00, 'materials', 64, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'LVL Beam 1.75x14x16ft',          'Laminated veneer lumber, 1.75" x 14" x 16ft',           'ea', 235.00, 'materials', 65, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'LVL Beam 3.5x9.5x16ft',          'Laminated veneer lumber, 3.5" x 9.5" x 16ft (double)',  'ea', 285.00, 'materials', 66, '2026-05-22');
