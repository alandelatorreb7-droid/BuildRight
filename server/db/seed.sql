-- BuildRight Seed Data — El Paso TX Construction Prices 2024-2025

TRUNCATE items, categories RESTART IDENTITY CASCADE;

INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Materials',        'materials',       '🧱', 1),
  ('Labor',            'labor',           '👷', 2),
  ('Concrete',         'concrete',        '🏗️', 3),
  ('Plumbing',         'plumbing',        '🔧', 4),
  ('Electrical',       'electrical',      '⚡', 5),
  ('HVAC',             'hvac',            '❄️', 6),
  ('Framing',          'framing',         '🪵', 7),
  ('Roofing',          'roofing',         '🏠', 8),
  ('Finishes',         'finishes',        '🎨', 9),
  ('Equipment Rental', 'equipment',       '🚜', 10),
  ('Permits & Fees',   'permits',         '📋', 11);

-- ──────────────────────────────────────────────
-- MATERIALS
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (1, 'CMU Block (8" Standard)',        'Concrete masonry unit, standard gray',       'ea',      2.85,  'materials', 1),
  (1, 'CMU Block (4" Standard)',        'Concrete masonry unit, 4-inch',              'ea',      1.95,  'materials', 2),
  (1, 'Brick (Standard Modular)',       'Standard red facing brick',                  'ea',      0.88,  'materials', 3),
  (1, 'Rebar #3 (3/8")',               'Deformed steel rebar, 20 ft stick',          'lf',      0.55,  'materials', 4),
  (1, 'Rebar #4 (1/2")',               'Deformed steel rebar, 20 ft stick',          'lf',      0.78,  'materials', 5),
  (1, 'Rebar #5 (5/8")',               'Deformed steel rebar, 20 ft stick',          'lf',      0.98,  'materials', 6),
  (1, 'Wire Mesh 6x6 W1.4',            'Welded wire mesh for slabs',                 'sqft',    0.48,  'materials', 7),
  (1, 'Lumber 2x4x8',                  'SPF dimensional lumber',                     'ea',      5.65,  'materials', 8),
  (1, 'Lumber 2x4x10',                 'SPF dimensional lumber',                     'ea',      6.95,  'materials', 9),
  (1, 'Lumber 2x4x12',                 'SPF dimensional lumber',                     'ea',      8.25,  'materials', 10),
  (1, 'Lumber 2x6x8',                  'SPF dimensional lumber',                     'ea',      8.45,  'materials', 11),
  (1, 'Lumber 2x6x12',                 'SPF dimensional lumber',                     'ea',     12.50,  'materials', 12),
  (1, 'Lumber 2x8x12',                 'SPF dimensional lumber',                     'ea',     16.25,  'materials', 13),
  (1, 'Plywood 4x8 3/4" CDX',         'Structural plywood sheathing',               'sheet',  54.00,  'materials', 14),
  (1, 'Plywood 4x8 1/2" CDX',         'Structural plywood sheathing',               'sheet',  38.50,  'materials', 15),
  (1, 'OSB 4x8 7/16"',               'Oriented strand board sheathing',             'sheet',  28.75,  'materials', 16),
  (1, 'Drywall 4x8 1/2"',            'Standard gypsum board',                       'sheet',  14.85,  'materials', 17),
  (1, 'Drywall 4x12 1/2"',           'Standard gypsum board, long sheet',           'sheet',  22.50,  'materials', 18),
  (1, 'Drywall 4x8 5/8" Type-X',     'Fire-rated gypsum board',                    'sheet',  18.95,  'materials', 19),
  (1, 'Insulation R-13 Batt',         'Fiberglass batt, 2x4 wall cavity',           'sqft',    0.65,  'materials', 20),
  (1, 'Insulation R-19 Batt',         'Fiberglass batt, 2x6 wall cavity',           'sqft',    0.88,  'materials', 21),
  (1, 'Insulation R-30 Batt',         'Attic fiberglass batt',                      'sqft',    1.15,  'materials', 22),
  (1, 'Rigid Foam 2" Polyiso',         'Polyisocyanurate roof insulation board',     'sqft',    1.85,  'materials', 23),
  (1, 'Asphalt Shingles 3-Tab',        'Standard 3-tab roofing shingles',            'square',  98.00, 'materials', 24),
  (1, 'Architectural Shingles',        '30-yr dimensional shingles',                 'square', 145.00, 'materials', 25),
  (1, 'Metal Roofing Panel (26ga)',     'Standing seam metal panel',                 'square', 185.00, 'materials', 26),
  (1, 'Roofing Underlayment 15#',      'Felt paper, 4-square roll',                 'roll',    42.00, 'materials', 27),
  (1, 'PVC Pipe 4" Sch 40',            'Schedule 40 PVC drain pipe, 10 ft',         'lf',       8.85, 'materials', 28),
  (1, 'PVC Pipe 3" Sch 40',            'Schedule 40 PVC drain pipe, 10 ft',         'lf',       6.25, 'materials', 29),
  (1, 'Copper Pipe 3/4" Type L',       'Type L copper water supply pipe',           'lf',       4.45, 'materials', 30),
  (1, 'Copper Pipe 1/2" Type L',       'Type L copper water supply pipe',           'lf',       3.15, 'materials', 31),
  (1, 'EMT Conduit 1/2"',             '10-ft electrical metallic tubing',            'lf',       2.15, 'materials', 32),
  (1, 'EMT Conduit 3/4"',             '10-ft electrical metallic tubing',            'lf',       3.25, 'materials', 33),
  (1, '12/2 NM-B Wire (Romex)',        'Non-metallic sheathed cable, 250 ft roll',  'lf',       0.98, 'materials', 34),
  (1, '14/2 NM-B Wire (Romex)',        'Non-metallic sheathed cable, 250 ft roll',  'lf',       0.72, 'materials', 35),
  (1, 'Anchor Bolts 1/2"x10"',        'J-bolt concrete anchor, box of 50',          'ea',       1.25, 'materials', 36),
  (1, 'Hurricane Straps H2.5',         'Rafter-to-plate connector, 50 ct box',      'ea',       1.85, 'materials', 37),
  (1, 'Joist Hanger LUS26',            'Single 2x6 joist hanger',                   'ea',       2.45, 'materials', 38);

-- ──────────────────────────────────────────────
-- LABOR (standalone crew rates)
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (2, 'General Laborer',               'General construction labor, El Paso area',   'hr',      18.50, 'labor', 1),
  (2, 'Lead Carpenter',                'Experienced finish/framing carpenter',        'hr',      34.00, 'labor', 2),
  (2, 'Apprentice Carpenter',          'Apprentice-level carpenter',                 'hr',      22.00, 'labor', 3),
  (2, 'Journeyman Electrician',        'Licensed journeyman electrician',            'hr',      52.00, 'labor', 4),
  (2, 'Apprentice Electrician',        'Apprentice electrician',                     'hr',      28.00, 'labor', 5),
  (2, 'Journeyman Plumber',            'Licensed journeyman plumber',                'hr',      56.00, 'labor', 6),
  (2, 'Apprentice Plumber',            'Apprentice plumber',                         'hr',      30.00, 'labor', 7),
  (2, 'HVAC Technician',               'Certified HVAC mechanic',                    'hr',      58.00, 'labor', 8),
  (2, 'Concrete Finisher',             'Flatwork and finishing specialist',           'hr',      38.00, 'labor', 9),
  (2, 'Roofer',                        'Roofing installer',                          'hr',      36.00, 'labor', 10),
  (2, 'Painter (Interior)',            'Interior paint journeyman',                  'hr',      28.00, 'labor', 11),
  (2, 'Painter (Exterior)',            'Exterior paint journeyman',                  'hr',      30.00, 'labor', 12),
  (2, 'Tile Setter',                   'Ceramic/porcelain tile installer',           'hr',      42.00, 'labor', 13),
  (2, 'Drywall Installer',             'Hang, tape, bed, and texture',              'hr',      34.00, 'labor', 14),
  (2, 'Welder (Structural)',           'Structural/misc iron welder',                'hr',      48.00, 'labor', 15),
  (2, 'Equipment Operator',            'Heavy equipment operator',                   'hr',      45.00, 'labor', 16),
  (2, 'Site Superintendent',           'On-site project supervision',                'hr',      55.00, 'labor', 17),
  (2, 'Project Foreman',               'Working foreman, crew lead',                 'hr',      50.00, 'labor', 18),
  (2, 'Mason / Block Layer',           'CMU and brick masonry worker',               'hr',      40.00, 'labor', 19),
  (2, 'Flooring Installer',            'Hardwood/LVP/carpet installer',              'hr',      36.00, 'labor', 20);

-- ──────────────────────────────────────────────
-- CONCRETE (includes ready-mix, forming, finishing)
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (3, 'Ready-Mix Concrete 3000 PSI',   'Delivered, includes short-load fee <5 yd',  'cu yd',  168.00, 'materials', 1),
  (3, 'Ready-Mix Concrete 4000 PSI',   'Delivered, suitable for driveways/slabs',   'cu yd',  178.00, 'materials', 2),
  (3, 'Ready-Mix Concrete 5000 PSI',   'High-strength structural mix',              'cu yd',  192.00, 'materials', 3),
  (3, 'Pump Truck Service',            'Boom pump, setup + 4-hr minimum',           'day',    895.00, 'other',     4),
  (3, 'Concrete Forming (Labor)',      'Set and strip wood forms',                  'sqft',     3.65, 'labor',     5),
  (3, 'Slab Finishing (Labor)',        'Screed, float, broom finish',               'sqft',     2.65, 'labor',     6),
  (3, 'Decorative Concrete Finish',    'Exposed aggregate or stamped finish',       'sqft',     5.50, 'labor',     7),
  (3, 'Concrete Sealer (Penetrating)', 'Silane/siloxane sealer, applied',           'sqft',     0.55, 'materials', 8),
  (3, 'Fiber Mesh Additive',           'Polypropylene fiber per yard of concrete',  'cu yd',    8.00, 'materials', 9),
  (3, 'Accelerator Admixture',         'Cold-weather set accelerator per yard',     'cu yd',    6.50, 'materials', 10),
  (3, 'Concrete Saw Cutting',          'Control joint saw cut per linear foot',     'lf',       1.85, 'other',     11),
  (3, 'Vapor Barrier 10-mil',          'Polyethylene under-slab vapor barrier',     'sqft',     0.22, 'materials', 12);

-- ──────────────────────────────────────────────
-- PLUMBING
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (4, 'Rough-in Per Fixture',          'DWV rough-in, per plumbing fixture',        'ea',     465.00, 'labor',     1),
  (4, 'Water Heater Install (40 gal)', 'Standard tank WH installation, no unit',   'ea',     385.00, 'labor',     2),
  (4, 'Tankless WH Install',           'On-demand water heater install, no unit',  'ea',     575.00, 'labor',     3),
  (4, 'Water Heater (40 gal electric)','Bradford White or equivalent',             'ea',     685.00, 'materials', 4),
  (4, 'Water Heater (40 gal gas)',     'Bradford White or equivalent',             'ea',     725.00, 'materials', 5),
  (4, 'Tankless WH (gas)',             'Rinnai or equivalent, 199K BTU',           'ea',    1250.00, 'materials', 6),
  (4, 'Main Water Line (1" PEX)',      'PEX supply line, labor + material/lf',     'lf',      18.50, 'other',     7),
  (4, 'Drain Line 4" PVC (L+M)',       'Cast iron stack or PVC, labor + mat/lf',  'lf',      24.00, 'other',     8),
  (4, 'Hose Bib Install',             'Exterior faucet, wall mount, L+M',          'ea',     185.00, 'other',     9),
  (4, 'Pressure Reducer Valve',        'PRV install with unions, L+M',             'ea',     385.00, 'other',     10),
  (4, 'Shower Pan Install',            'Mud bed + liner or acrylic pan',           'ea',     650.00, 'other',     11),
  (4, 'Toilet Install',               'Standard toilet set, wax ring, supply',     'ea',     185.00, 'labor',     12),
  (4, 'Vanity Faucet Install',         'Single or double handle, supply lines',    'ea',     135.00, 'labor',     13),
  (4, 'Kitchen Faucet Install',        'Kitchen faucet with supply lines',         'ea',     165.00, 'labor',     14),
  (4, 'Garbage Disposal Install',      'Disposal unit installation, no unit',      'ea',     145.00, 'labor',     15),
  (4, 'Backflow Preventer Install',    'RPZ or dual-check, L+M',                   'ea',     425.00, 'other',     16);

-- ──────────────────────────────────────────────
-- ELECTRICAL
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (5, 'Outlet (Duplex) Install',       'Standard 15A outlet, L+M',                 'ea',     125.00, 'other',     1),
  (5, 'GFCI Outlet Install',           'GFCI outlet, bathrooms/kitchens, L+M',    'ea',     165.00, 'other',     2),
  (5, 'Switch (Single-Pole) Install',  'Standard light switch, L+M',               'ea',     115.00, 'other',     3),
  (5, '3-Way Switch Install',          '3-way switch, L+M',                        'ea',     165.00, 'other',     4),
  (5, 'Dimmer Switch Install',         'LED-compatible dimmer, L+M',               'ea',     185.00, 'other',     5),
  (5, 'Panel Upgrade 200A',            'New 200A main panel, L+M',                 'ea',    2350.00, 'other',     6),
  (5, 'Panel Upgrade 400A',            'New 400A main panel, L+M',                 'ea',    3850.00, 'other',     7),
  (5, 'Sub-Panel 100A Install',        '100A sub-panel, L+M',                      'ea',    1250.00, 'other',     8),
  (5, 'Recessed Light (4") Install',   'LED can light, L+M',                       'ea',     145.00, 'other',     9),
  (5, 'Recessed Light (6") Install',   'LED can light, L+M',                       'ea',     155.00, 'other',     10),
  (5, 'Ceiling Fan Install',           'Ceiling fan with light kit, L+M',          'ea',     195.00, 'other',     11),
  (5, 'Pendant Light Install',         'Single pendant, L+M',                      'ea',     145.00, 'other',     12),
  (5, 'Smoke Detector (Hardwired)',    'Interconnected smoke alarm, L+M',          'ea',      88.00, 'other',     13),
  (5, 'CO Detector Install',           'Carbon monoxide detector, L+M',            'ea',      95.00, 'other',     14),
  (5, 'Exhaust Fan Install',           'Bathroom exhaust fan, L+M',                'ea',     185.00, 'other',     15),
  (5, 'EV Charger (Level 2)',          '240V EVSE circuit + outlet, L+M',          'ea',     850.00, 'other',     16),
  (5, 'Dedicated Circuit (240V)',      'New 240V circuit, 30-50A, L+M',            'ea',     385.00, 'other',     17),
  (5, 'Conduit Run (EMT, per LF)',     'EMT conduit with wire, L+M/lf',            'lf',       8.50, 'other',     18),
  (5, 'Whole-House Generator Hook-Up', 'Transfer switch + generator tie-in, L+M', 'ea',    1850.00, 'other',     19);

-- ──────────────────────────────────────────────
-- HVAC
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (6, 'AC Unit 2-Ton (Split)',         'Carrier/Lennox 14 SEER, install + unit',   'ea',    4650.00, 'other',     1),
  (6, 'AC Unit 3-Ton (Split)',         'Carrier/Lennox 14 SEER, install + unit',   'ea',    5650.00, 'other',     2),
  (6, 'AC Unit 4-Ton (Split)',         'Carrier/Lennox 14 SEER, install + unit',   'ea',    6950.00, 'other',     3),
  (6, 'AC Unit 5-Ton (Split)',         'Carrier/Lennox 14 SEER, install + unit',   'ea',    8450.00, 'other',     4),
  (6, 'Mini-Split 9,000 BTU',         'Single-zone ductless, install + unit',      'ea',    3250.00, 'other',     5),
  (6, 'Mini-Split 12,000 BTU',        'Single-zone ductless, install + unit',      'ea',    3650.00, 'other',     6),
  (6, 'Mini-Split 18,000 BTU',        'Single-zone ductless, install + unit',      'ea',    4250.00, 'other',     7),
  (6, 'Mini-Split 24,000 BTU',        'Single-zone ductless, install + unit',      'ea',    4850.00, 'other',     8),
  (6, 'Air Handler Install',           'Indoor air handler, labor only',            'ea',    1250.00, 'labor',     9),
  (6, 'Furnace Install (80K BTU)',     'Gas furnace, labor only',                  'ea',    1450.00, 'labor',     10),
  (6, 'Ductwork (Flexible, per LF)',  'Flex duct, installed',                       'lf',      14.00, 'other',     11),
  (6, 'Ductwork (Sheet Metal, per LF)','Galvanized sheet metal duct, installed',   'lf',      28.00, 'other',     12),
  (6, 'Supply/Return Grille Install',  'Register + boot install',                  'ea',      85.00, 'other',     13),
  (6, 'Thermostat (Smart) Install',   'Nest/Ecobee or equivalent, L+M',           'ea',     225.00, 'other',     14),
  (6, 'AC Refrigerant Recharge R-410A','Per pound of refrigerant added',           'lb',      65.00, 'other',     15),
  (6, 'Attic Ventilation Fan',         'Solar or electric attic fan, L+M',         'ea',     485.00, 'other',     16);

-- ──────────────────────────────────────────────
-- FRAMING
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (7, 'Wall Framing 2x4 (Labor)',      'Stud wall framing, labor per LF of wall',  'lf',      12.50, 'labor',     1),
  (7, 'Wall Framing 2x6 (Labor)',      'Exterior 2x6 wall framing, labor/lf',      'lf',      15.50, 'labor',     2),
  (7, 'Floor Joist Install (Labor)',   'Floor joist layout and install, labor/lf', 'lf',       6.50, 'labor',     3),
  (7, 'Roof Rafter (Stick Frame)',     'Cut and install rafters, labor/lf',        'lf',       9.50, 'labor',     4),
  (7, 'Roof Truss Set (Labor)',        'Set pre-fab trusses, crane not incl.',     'lf',       5.50, 'labor',     5),
  (7, 'Structural Steel Beam Install', 'Set and weld beam, per LF',                'lf',      48.00, 'other',     6),
  (7, 'LVL Beam Install (Labor)',      'Laminated veneer lumber beam, labor/lf',   'lf',      22.00, 'labor',     7),
  (7, 'Header Install (Labor)',        'Door/window header, labor per opening',    'ea',     165.00, 'labor',     8),
  (7, 'Blocking and Bridging',         'Fire blocking / solid bridging, labor/lf', 'lf',       4.50, 'labor',     9),
  (7, 'Sub-Floor Install (Labor)',     'OSB sub-floor, labor per sqft',            'sqft',     1.85, 'labor',     10),
  (7, 'Stair Framing (Labor)',         'Stair stringers, treads, per flight',      'ea',     850.00, 'labor',     11),
  (7, 'Crane Rental (Framing)',        '50-ton hydraulic crane, 4-hr min',         'day',   1850.00, 'other',     12);

-- ──────────────────────────────────────────────
-- ROOFING
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (8, 'Asphalt Shingles Install',      '3-tab, tear-off not included, L+M',        'square', 185.00, 'other',     1),
  (8, 'Architectural Shingles Install','30-yr dimensional, L+M',                   'square', 265.00, 'other',     2),
  (8, 'Metal Roofing (Screw-Down)',    'Exposed fastener panel, L+M',              'square', 325.00, 'other',     3),
  (8, 'Standing Seam Metal Roof',      'Hidden fastener, commercial grade, L+M',  'square', 485.00, 'other',     4),
  (8, 'TPO Flat Roof (Fully Adhered)', '60-mil TPO membrane, L+M',                'square', 425.00, 'other',     5),
  (8, 'Modified Bitumen (Torch-Down)', '2-ply SBS mod bit, L+M',                  'square', 385.00, 'other',     6),
  (8, 'Roof Tear-Off (1 layer)',       'Remove and haul away one shingle layer',  'square',  75.00, 'labor',     7),
  (8, 'Roof Decking (OSB 7/16")',      'Decking replace or new, L+M/sqft',        'sqft',     2.25, 'other',     8),
  (8, 'Ridge Cap Installation',        'Hip/ridge cap shingles, L+M',              'lf',       6.50, 'other',     9),
  (8, 'Drip Edge Install',             'Aluminum drip edge, L+M',                  'lf',       3.25, 'other',     10),
  (8, 'Fascia Board Replace (1x6)',    'Cedar or PVC fascia, L+M',                 'lf',       8.50, 'other',     11),
  (8, 'Gutter Install (5" K-style)',   'Aluminum gutter, L+M',                     'lf',       9.50, 'other',     12),
  (8, 'Downspout Install',             'Aluminum downspout 2x3, L+M',              'lf',       6.25, 'other',     13),
  (8, 'Skylight Install (2x4)',        'Fixed skylight with flashing kit, L+M',   'ea',    1650.00, 'other',     14),
  (8, 'Pipe Boot / Vent Flashing',     'Lead or rubber pipe flashing, L+M',       'ea',      85.00, 'other',     15);

-- ──────────────────────────────────────────────
-- FINISHES
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (9, 'Drywall Hang & Tape (Labor)',   'Hang, tape, bed, sand — ready for texture', 'sqft',    1.85, 'labor',     1),
  (9, 'Texture — Orange Peel',         'Spray orange peel texture, L+M',            'sqft',    0.88, 'other',     2),
  (9, 'Texture — Knock-Down',          'Knock-down texture, L+M',                   'sqft',    0.95, 'other',     3),
  (9, 'Texture — Skip-Trowel',         'Skip-trowel finish, L+M',                   'sqft',    1.25, 'other',     4),
  (9, 'Interior Paint (Labor)',        'Prep, prime, 2 coats, no materials',        'sqft',    1.25, 'labor',     5),
  (9, 'Interior Paint (L+M)',          'Prep, prime, 2-coat paint, materials incl.','sqft',    2.15, 'other',     6),
  (9, 'Exterior Paint (L+M)',          'Prep, prime, 2-coat, including materials', 'sqft',    2.85, 'other',     7),
  (9, 'Ceramic Tile Install (Floor)',  '12x12 or 12x24, L+M (tile not incl.)',      'sqft',    7.50, 'labor',     8),
  (9, 'Porcelain Tile Install (Floor)','Large-format 24x24, L+M (tile not incl.)', 'sqft',    9.50, 'labor',     9),
  (9, 'Tile Install (Shower/Wall)',    'Wall tile installation, L+M (tile not incl.)', 'sqft', 9.50, 'labor',    10),
  (9, 'Hardwood Floor Install',        '3/4" nail-down hardwood, L+M incl. nails', 'sqft',   10.50, 'other',     11),
  (9, 'LVP / Vinyl Plank Install',     'Click-lock luxury vinyl plank, L+M',        'sqft',    4.85, 'other',     12),
  (9, 'Laminate Floor Install',        'AC3 laminate, L+M',                         'sqft',    4.25, 'other',     13),
  (9, 'Carpet Install (L+M)',          'Includes pad and tack strip',               'sqft',    4.15, 'other',     14),
  (9, 'Baseboard (3.5" MDF, L+M)',    'Paint-grade MDF base, nail + caulk',        'lf',       4.25, 'other',     15),
  (9, 'Crown Molding (3.5", L+M)',    'Paint-grade crown, nail + caulk',            'lf',       6.50, 'other',     16),
  (9, 'Door Install (Pre-Hung Int.)', '6-8 interior pre-hung door, L+M',            'ea',     285.00, 'other',    17),
  (9, 'Door Install (Exterior)',       'Fiberglass or steel ext. door, L+M',        'ea',     485.00, 'other',    18),
  (9, 'Window Install (Vinyl)',        'Single/DH vinyl window, L+M, per unit',     'ea',     385.00, 'other',    19),
  (9, 'Cabinet Install (Labor)',       'Upper + lower cabinets, labor/lf run',      'lf',     185.00, 'labor',    20),
  (9, 'Countertop — Laminate',         'Laminate top, L+M',                         'lf',      85.00, 'other',    21),
  (9, 'Countertop — Granite (L+M)',    'Granite slab, fabricate + install',         'sqft',    75.00, 'other',    22),
  (9, 'Countertop — Quartz (L+M)',     'Engineered quartz, fab + install',          'sqft',    85.00, 'other',    23),
  (9, 'Backsplash Tile (L+M)',         '4x4 ceramic or subway tile, L+M',           'sqft',   18.50, 'other',    24),
  (9, 'Caulking / Sealants (Labor)',   'Bathroom, kitchen, exterior caulk labor',  'hr',      28.00, 'labor',    25);

-- ──────────────────────────────────────────────
-- EQUIPMENT RENTAL
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (10, 'Mini Excavator (2-4 ton)',      'Includes operator, 8-hr day',             'day',    485.00, 'other',     1),
  (10, 'Skid Steer Loader',            'Includes operator, 8-hr day',             'day',    425.00, 'other',     2),
  (10, 'Backhoe (JD 310)',             'Includes operator, 8-hr day',             'day',    625.00, 'other',     3),
  (10, 'Concrete Mixer (9 CF)',         'Drum mixer, trailer-mount, no operator',  'day',    155.00, 'other',     4),
  (10, 'Scissor Lift (19 ft)',          'Electric, indoor use, no operator',       'day',    295.00, 'other',     5),
  (10, 'Boom Lift (45 ft)',             'Articulating boom, no operator',          'day',    525.00, 'other',     6),
  (10, 'Boom Lift (60 ft)',             'Articulating boom, no operator',          'day',    685.00, 'other',     7),
  (10, 'Portable Generator (20 kW)',    'Towable diesel generator',                'day',    195.00, 'other',     8),
  (10, 'Plate Compactor',              'Reversible plate compactor',               'day',      88.00, 'other',     9),
  (10, 'Jumping Jack Compactor',       'Trench/narrow-strip compactor',           'day',      95.00, 'other',     10),
  (10, 'Air Compressor (185 CFM)',      'Towable diesel air compressor',           'day',     165.00, 'other',     11),
  (10, 'Scaffolding (per section/day)','Frame scaffold section, 5x5x6 ft',        'day',      28.00, 'other',     12),
  (10, 'Dumpster (10-yard)',           '10 CY roll-off, 7-day rental + dump fee', 'ea',      385.00, 'other',     13),
  (10, 'Dumpster (20-yard)',           '20 CY roll-off, 7-day rental + dump fee', 'ea',      485.00, 'other',     14),
  (10, 'Trencher (Walk-Behind)',        '4" chain trencher, no operator',          'day',     215.00, 'other',     15),
  (10, 'Concrete Saw (14")',            'Gas-powered walk-behind saw',             'day',      95.00, 'other',     16),
  (10, 'Water Pump (3" Trash)',         'Dewatering/trash pump',                   'day',      65.00, 'other',     17);

-- ──────────────────────────────────────────────
-- PERMITS & FEES (El Paso, TX — 2024-2025)
-- ──────────────────────────────────────────────
INSERT INTO items (category_id, name, description, unit, unit_price, item_type, sort_order) VALUES
  (11, 'Building Permit (Residential)','City of El Paso base permit fee',          'ea',     385.00, 'other',     1),
  (11, 'Plan Review Fee',              'City plan check fee, standard review',     'ea',     365.00, 'other',     2),
  (11, 'Electrical Permit',            'El Paso City electrical permit',           'ea',     185.00, 'other',     3),
  (11, 'Plumbing Permit',              'El Paso City plumbing permit',             'ea',     165.00, 'other',     4),
  (11, 'Mechanical Permit (HVAC)',     'El Paso City mechanical permit',           'ea',     155.00, 'other',     5),
  (11, 'Demolition Permit',            'Partial or full demo permit',              'ea',     135.00, 'other',     6),
  (11, 'Grading / Earthwork Permit',  'Grading permit, up to 1 acre',             'ea',     285.00, 'other',     7),
  (11, 'Fence Permit',                 'Residential fence permit',                 'ea',      85.00, 'other',     8),
  (11, 'Driveway Approach Permit',     'City right-of-way driveway permit',       'ea',     125.00, 'other',     9),
  (11, 'Inspection Fee (per visit)',   'Third-party or city inspection',           'ea',      88.00, 'other',     10),
  (11, 'Impact Fee (per sqft)',        'El Paso impact/development fee',           'sqft',     2.95, 'other',     11),
  (11, 'Utility Tap Fee (Water)',      'EPWU water service connection',            'ea',    2850.00, 'other',     12),
  (11, 'Utility Tap Fee (Sewer)',      'EPWU sewer connection fee',               'ea',    1950.00, 'other',     13),
  (11, 'Certificate of Occupancy',     'C of O application fee',                  'ea',     125.00, 'other',     14),
  (11, 'Variance Application',         'Zoning variance request fee',             'ea',     485.00, 'other',     15),
  (11, 'Asbestos Survey (per bldg)',   'Required for pre-1980 demo projects',     'ea',     650.00, 'other',     16);
