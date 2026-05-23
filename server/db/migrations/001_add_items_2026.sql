-- Migration 001: Add 55 new items + Bathroom & Accessories category
-- El Paso TX 2026 market prices — 2026-05-22

-- ── New category ──────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, icon, sort_order)
VALUES ('Bathroom & Accessories', 'bathroom', '🚿', 12)
ON CONFLICT (slug) DO NOTHING;

-- ── Update existing drywall item to 2026 price ────────────────────────────────
UPDATE items SET unit_price = 19.75, price_updated_at = '2026-05-22'
WHERE name = 'Drywall 4x8 5/8" Type-X';

-- ── FRAMING: metal studs & track ─────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order, price_updated_at) VALUES
  ((SELECT id FROM categories WHERE slug = 'framing'), 'Metal Stud 3-5/8" x 10ft',  'Steel stud 25-gauge, 3-5/8" wide x 10ft',   'ea',     8.50, 'materials', 13, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'framing'), 'Metal Track 3-5/8" x 10ft', 'Steel track 25-gauge, 3-5/8" wide x 10ft',  'ea',     6.00, 'materials', 14, '2026-05-22');

-- ── MATERIALS: drywall supplies, hardware, paint ─────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order, price_updated_at) VALUES
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Insulation R-13 Batt (bag)',      'Fiberglass batt 2x4 wall cavity, per bag',       'bag',    38.00, 'materials', 45, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Drywall Screws 1lb',              'Coarse thread drywall screws 1-5/8", 1lb box',   'box',     9.50, 'materials', 46, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Framing Screws (box)',             'Self-drilling metal framing screws, box',         'box',    15.00, 'materials', 47, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Tapcon Anchors 1/4" (box)',        'Concrete screw anchors 1/4" x 1-3/4", box',      'box',    22.00, 'materials', 48, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Joint Compound 4.5 gal',           'All-purpose joint compound, 4.5 gallon bucket',  'bucket', 21.00, 'materials', 49, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Drywall Tape 250ft',               'Paper joint tape, 250ft roll',                   'roll',    6.00, 'materials', 50, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Corner Bead 8ft metal',            'Metal corner bead, 8ft stick',                   'ea',      4.50, 'materials', 51, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Interior Drywall Primer 1 gal',    'PVA drywall primer, 1 gallon',                   'gallon', 26.00, 'materials', 52, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Vinyl Acrylic Paint 1 gal',        'Interior latex paint, 1 gallon',                 'gallon', 45.00, 'materials', 53, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Sanding Sponge medium grit',       'Medium grit dual-angle sanding sponge',          'ea',      4.50, 'materials', 54, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'materials'), 'Grout Sanded 25lb',                'Sanded tile grout, 25lb bag',                    'bag',    24.00, 'materials', 55, '2026-05-22');

-- ── PLUMBING: pipe, fittings, valves, fixtures ───────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order, price_updated_at) VALUES
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'PEX Pipe 1/2" 100ft roll',         'PEX-A tubing, 1/2" x 100ft roll',                      'roll',  52.00, 'materials', 17, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Copper Pipe 1/2" Type L 10ft',     'Type L copper supply pipe, 10ft stick',                 'ea',    26.00, 'materials', 18, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Ball Valve 1/2" brass',             'Full-port brass ball valve, 1/2"',                      'ea',    14.00, 'materials', 19, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Angle Stop Valve 1/2"x3/8"',       'Compression angle stop, 1/2" IPS x 3/8" OD',           'ea',    11.00, 'materials', 20, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Pipe Insulation foam 6ft',          'Foam pipe wrap, 1/2" ID x 6ft stick',                  'ea',     5.50, 'materials', 21, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Pipe Hangers (bag)',                'Plastic pipe clamps/hangers, bag of 25',                'bag',    9.00, 'materials', 22, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'PVC Pipe 2" Sch 40 10ft',          'Schedule 40 PVC DWV pipe, 2" x 10ft stick',            'ea',    15.00, 'materials', 23, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'PVC Pipe 3" Sch 40 10ft',          'Schedule 40 PVC DWV pipe, 3" x 10ft stick',            'ea',    22.00, 'materials', 24, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'PVC Elbow 90°',                    'Schedule 40 PVC street elbow, 90 degree',               'ea',     3.50, 'materials', 25, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'PVC Tee sanitary',                  'Schedule 40 PVC sanitary tee',                          'ea',     6.50, 'materials', 26, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'PVC Coupling',                      'Schedule 40 PVC slip coupling',                         'ea',     2.50, 'materials', 27, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Closet Flange PVC',                 'PVC closet flange with ring, 4"x3"',                    'ea',    12.00, 'materials', 28, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'PVC Primer purple',                 'Purple PVC primer, 4 oz can',                           'can',   11.00, 'materials', 29, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'PVC Cement',                        'Clear medium-body PVC cement, 4 oz can',                 'can',   11.00, 'materials', 30, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Toilet elongated commercial',       'Commercial-grade elongated toilet, white',               'ea',   285.00, 'materials', 31, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Lavatory Sink wall mount',          'Commercial wall-mount lavatory sink, white',             'ea',   185.00, 'materials', 32, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Faucet commercial chrome',          'Commercial 4" centerset faucet, chrome finish',          'ea',   145.00, 'materials', 33, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'P-Trap 1-1/4"',                    'Chrome or PVC P-trap, 1-1/4"',                           'ea',    15.00, 'materials', 34, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Supply Lines braided (pair)',        'Braided stainless supply lines, 12" pair',               'pair',  14.00, 'materials', 35, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Wax Ring toilet seal',              'Standard toilet wax ring with horn',                     'ea',     7.50, 'materials', 36, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Silicone Sealant tube',             'Waterproof silicone sealant, 10.3 oz tube',              'tube',   9.00, 'materials', 37, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Floor Drain commercial',            'Commercial floor drain assembly, 4" cast iron',          'ea',    85.00, 'materials', 38, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'plumbing'), 'Cleanout Cover PVC',                'PVC cleanout plug and cover, 4"',                        'ea',    16.00, 'materials', 39, '2026-05-22');

-- ── BATHROOM & ACCESSORIES ────────────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order, price_updated_at) VALUES
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Mirror frameless commercial',       'Frameless commercial-grade plate glass mirror',          'ea',   145.00, 'materials',  1, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Toilet Paper Dispenser SS',         'Surface-mount stainless steel TP dispenser',             'ea',    55.00, 'materials',  2, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Soap Dispenser wall mount',         'Stainless wall-mount liquid soap dispenser',             'ea',    45.00, 'materials',  3, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Paper Towel Dispenser SS',          'Surface-mount stainless paper towel dispenser',          'ea',   110.00, 'materials',  4, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Hand Dryer commercial electric',    'Commercial 110V electric hand dryer',                    'ea',   385.00, 'materials',  5, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Grab Bar ADA stainless 36in',       'ADA-compliant 36" stainless steel grab bar',             'ea',    75.00, 'materials',  6, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Trash Receptacle stainless',        'Commercial stainless step-on trash receptacle',          'ea',    85.00, 'materials',  7, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Coat Hook stainless wall',          'Stainless steel wall-mount coat/robe hook',              'ea',    14.00, 'materials',  8, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Door Stop commercial',              'Commercial floor or wall-mount door stop',               'ea',    16.00, 'materials',  9, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Restroom Signage ADA',              'ADA compliant restroom sign with braille',               'ea',    32.00, 'materials', 10, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Partition Panels bathroom stall',   'Powder-coated steel toilet partition panel',             'ea',   750.00, 'materials', 11, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Partition Hardware set',            'Complete toilet stall hardware set',                     'set',  140.00, 'materials', 12, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'bathroom'), 'Vanity Countertop quartz',          'Engineered quartz vanity countertop, per sf',            'sf',    70.00, 'materials', 13, '2026-05-22');

-- ── ELECTRICAL: fixtures and devices (material units only) ───────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order, price_updated_at) VALUES
  ((SELECT id FROM categories WHERE slug = 'electrical'), 'LED Light Fixture commercial',   'Commercial LED troffer ceiling fixture, 2x4',            'ea',   145.00, 'materials', 20, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'electrical'), 'Exhaust Fan bathroom (unit)',     'Bathroom exhaust fan unit, 110 CFM',                     'ea',   185.00, 'materials', 21, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'electrical'), 'GFCI Outlet (device)',            'GFCI receptacle device only, 15A 125V',                  'ea',    22.00, 'materials', 22, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'electrical'), 'Light Switch commercial (device)','Commercial-grade single-pole switch device',              'ea',    14.00, 'materials', 23, '2026-05-22'),
  ((SELECT id FROM categories WHERE slug = 'electrical'), 'Electrical Conduit EMT 10ft',     '1/2" EMT electrical metallic conduit, 10ft stick',       'ea',    28.00, 'materials', 24, '2026-05-22');
