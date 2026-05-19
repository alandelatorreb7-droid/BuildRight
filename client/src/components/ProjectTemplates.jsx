import { useState, useEffect } from 'react';

const fmt  = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const fmtK = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : fmt(n);

const TEMPLATES = [
  {
    id: 'room-addition',
    title: 'Room Addition',
    subtitle: '400 sq ft',
    description: 'Single-story addition with concrete slab, wood framing, drywall, roofing, basic electrical, interior paint, and building permit.',
    duration: '6–10 weeks',
    priceMin: 28000,
    priceMax: 42000,
    accent: '#1A1A2E',
    accentLight: '#E8EAF6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10.5L11 3l9 7.5"/>
        <path d="M4 9v10h5v-5h4v5h5V9"/>
        <path d="M15 5V3h2v3.5"/>
      </svg>
    ),
    items: [
      { name: 'Concrete 3000 PSI',              qty: 5,   unit: 'cy',   unit_price: 165,  item_type: 'materials' },
      { name: 'Concrete Finishing Labor',        qty: 400, unit: 'sqft', unit_price: 1.75, item_type: 'labor'     },
      { name: 'Framing Lumber (2×6)',            qty: 400, unit: 'sqft', unit_price: 5.50, item_type: 'materials' },
      { name: 'Framing Labor',                   qty: 400, unit: 'sqft', unit_price: 6.00, item_type: 'labor'     },
      { name: 'Insulation (R-19 Batts)',         qty: 400, unit: 'sqft', unit_price: 1.40, item_type: 'materials' },
      { name: 'Drywall (1/2")',                  qty: 400, unit: 'sqft', unit_price: 1.25, item_type: 'materials' },
      { name: 'Drywall Installation Labor',      qty: 400, unit: 'sqft', unit_price: 2.00, item_type: 'labor'     },
      { name: 'Architectural Shingles (30yr)',   qty: 400, unit: 'sqft', unit_price: 1.90, item_type: 'materials' },
      { name: 'Roofing Felt / Underlayment',     qty: 400, unit: 'sqft', unit_price: 0.25, item_type: 'materials' },
      { name: 'Roofing Installation Labor',      qty: 400, unit: 'sqft', unit_price: 2.80, item_type: 'labor'     },
      { name: 'Electrical Rough-In Labor',       qty: 400, unit: 'sqft', unit_price: 2.50, item_type: 'labor'     },
      { name: 'Electrical Materials (rough-in)', qty: 1,   unit: 'ls',   unit_price: 1200, item_type: 'materials' },
      { name: 'Interior Paint Materials',        qty: 400, unit: 'sqft', unit_price: 0.40, item_type: 'materials' },
      { name: 'Interior Paint Labor',            qty: 400, unit: 'sqft', unit_price: 1.50, item_type: 'labor'     },
      { name: 'Building Permit',                 qty: 1,   unit: 'ls',   unit_price: 2200, item_type: 'other'     },
    ],
  },
  {
    id: 'bathroom-remodel',
    title: 'Bathroom Remodel',
    subtitle: 'Full gut & rebuild',
    description: 'Complete remodel with plumbing rough-in, ceramic tile floor, moisture-resistant drywall, vanity, toilet, shower, paint, and permit.',
    duration: '2–3 weeks',
    priceMin: 9500,
    priceMax: 16000,
    accent: '#065F46',
    accentLight: '#ECFDF5',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11h16v2a7 7 0 0 1-7 7 7 7 0 0 1-7-7v-2z"/>
        <path d="M3 11V6a2 2 0 0 1 4 0v5"/>
        <path d="M8 4h1M8 7h2"/>
        <circle cx="15" cy="5" r="1"/>
        <path d="M11 19v2M15 19v2"/>
      </svg>
    ),
    items: [
      { name: 'Plumbing Rough-In Labor',              qty: 3,  unit: 'fixture', unit_price: 875,  item_type: 'labor'     },
      { name: 'Plumbing Materials (pipes, fittings)', qty: 1,  unit: 'ls',      unit_price: 680,  item_type: 'materials' },
      { name: 'Ceramic Floor Tile (12×12)',            qty: 50, unit: 'sqft',    unit_price: 2.50, item_type: 'materials' },
      { name: 'Tile Installation Labor',               qty: 50, unit: 'sqft',    unit_price: 6.50, item_type: 'labor'     },
      { name: 'Moisture-Resistant Drywall',            qty: 80, unit: 'sqft',    unit_price: 1.80, item_type: 'materials' },
      { name: 'Drywall Installation Labor',            qty: 80, unit: 'sqft',    unit_price: 2.25, item_type: 'labor'     },
      { name: 'Vanity (36" standard)',                 qty: 1,  unit: 'ea',      unit_price: 395,  item_type: 'materials' },
      { name: 'Vanity Installation Labor',             qty: 1,  unit: 'ea',      unit_price: 185,  item_type: 'labor'     },
      { name: 'Toilet (elongated, standard)',          qty: 1,  unit: 'ea',      unit_price: 295,  item_type: 'materials' },
      { name: 'Toilet Installation Labor',             qty: 1,  unit: 'ea',      unit_price: 150,  item_type: 'labor'     },
      { name: 'Shower Surround & Fixtures',           qty: 1,  unit: 'ls',      unit_price: 875,  item_type: 'materials' },
      { name: 'Shower Installation Labor',             qty: 1,  unit: 'ls',      unit_price: 475,  item_type: 'labor'     },
      { name: 'Interior Paint Materials',             qty: 80, unit: 'sqft',    unit_price: 0.85, item_type: 'materials' },
      { name: 'Interior Paint Labor',                 qty: 80, unit: 'sqft',    unit_price: 1.50, item_type: 'labor'     },
      { name: 'Building Permit',                       qty: 1,  unit: 'ls',      unit_price: 375,  item_type: 'other'     },
    ],
  },
  {
    id: 'concrete-driveway',
    title: 'Concrete Driveway',
    subtitle: '20 × 20 ft',
    description: '4" reinforced 3000 PSI driveway with #3 rebar grid, wire mesh, subgrade prep, forming, and professional finishing.',
    duration: '2–4 days',
    priceMin: 4200,
    priceMax: 6800,
    accent: '#B45309',
    accentLight: '#FFFBEB',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="14" width="18" height="5" rx="1"/>
        <path d="M5 14v-3M9 14V9M13 14V9M17 14v-3"/>
        <path d="M5 9h12"/>
        <path d="M7 3l-2 6M15 3l2 6"/>
      </svg>
    ),
    items: [
      { name: 'Concrete 3000 PSI',        qty: 5,   unit: 'cy',   unit_price: 165,  item_type: 'materials' },
      { name: 'Rebar #3 (3/8")',           qty: 520, unit: 'lf',   unit_price: 0.78, item_type: 'materials' },
      { name: 'Wire Mesh 6×6 WWF',         qty: 400, unit: 'sqft', unit_price: 0.48, item_type: 'materials' },
      { name: 'Form Boards (2×4)',          qty: 80,  unit: 'lf',   unit_price: 1.25, item_type: 'materials' },
      { name: 'Subgrade Prep Labor',       qty: 400, unit: 'sqft', unit_price: 0.85, item_type: 'labor'     },
      { name: 'Concrete Finisher Labor',   qty: 400, unit: 'sqft', unit_price: 2.75, item_type: 'labor'     },
      { name: 'Concrete Pump / Delivery',  qty: 1,   unit: 'ls',   unit_price: 375,  item_type: 'other'     },
    ],
  },
  {
    id: 'kitchen-remodel',
    title: 'Kitchen Remodel',
    subtitle: 'Mid-range, ~120 sqft',
    description: 'Semi-custom cabinets, granite/quartz countertops, porcelain tile floor, updated electrical outlets, and paint. No appliances.',
    duration: '3–5 weeks',
    priceMin: 18000,
    priceMax: 28000,
    accent: '#C0392B',
    accentLight: '#FEF2F2',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="8" width="18" height="12" rx="1"/>
        <path d="M2 12h18"/>
        <path d="M7 8V5a2 2 0 0 1 4 0v3"/>
        <path d="M6 15h2M14 15h2"/>
        <circle cx="15" cy="5" r="1.5"/>
        <path d="M15 3.5v-1M13.9 3.6l-.7-.7M13.5 5H12M13.9 6.4l-.7.7M15 6.5v1M16.1 6.4l.7.7M16.5 5H18M16.1 3.6l.7-.7"/>
      </svg>
    ),
    items: [
      { name: 'Kitchen Cabinets (semi-custom)',          qty: 20,  unit: 'lf',   unit_price: 195,  item_type: 'materials' },
      { name: 'Cabinet Installation Labor',              qty: 20,  unit: 'lf',   unit_price: 68,   item_type: 'labor'     },
      { name: 'Granite / Quartz Countertops',            qty: 30,  unit: 'sqft', unit_price: 68,   item_type: 'materials' },
      { name: 'Countertop Installation Labor',           qty: 30,  unit: 'sqft', unit_price: 16,   item_type: 'labor'     },
      { name: 'Porcelain Tile (20×20)',                  qty: 120, unit: 'sqft', unit_price: 3.75, item_type: 'materials' },
      { name: 'Tile Installation Labor',                 qty: 120, unit: 'sqft', unit_price: 7.50, item_type: 'labor'     },
      { name: 'Interior Paint Materials',                qty: 150, unit: 'sqft', unit_price: 0.90, item_type: 'materials' },
      { name: 'Interior Paint Labor',                    qty: 150, unit: 'sqft', unit_price: 1.50, item_type: 'labor'     },
      { name: 'Electrical Outlets / Circuits Labor',    qty: 8,   unit: 'ea',   unit_price: 90,   item_type: 'labor'     },
      { name: 'Electrical Materials (outlets, wiring)', qty: 1,   unit: 'ls',   unit_price: 340,  item_type: 'materials' },
      { name: 'Building Permit',                         qty: 1,   unit: 'ls',   unit_price: 675,  item_type: 'other'     },
    ],
  },
  {
    id: 'roof-replacement',
    title: 'Roof Replacement',
    subtitle: '2,000 sqft',
    description: '30-year architectural shingles with complete tear-off, underlayment, drip edge, ice & water shield, and debris haul-away.',
    duration: '2–4 days',
    priceMin: 10500,
    priceMax: 15000,
    accent: '#374151',
    accentLight: '#F3F4F6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 11L11 3l9 8"/>
        <rect x="5" y="11" width="12" height="8" rx="0.5"/>
        <path d="M8 11v8M14 11v8"/>
        <path d="M5 15h12"/>
      </svg>
    ),
    items: [
      { name: 'Architectural Shingles (30yr)', qty: 2000, unit: 'sqft', unit_price: 1.18, item_type: 'materials' },
      { name: 'Roofing Felt / Underlayment',   qty: 2000, unit: 'sqft', unit_price: 0.20, item_type: 'materials' },
      { name: 'Drip Edge',                     qty: 180,  unit: 'lf',   unit_price: 1.85, item_type: 'materials' },
      { name: 'Ice & Water Shield',             qty: 200,  unit: 'sqft', unit_price: 0.68, item_type: 'materials' },
      { name: 'Roofing Nails / Fasteners',     qty: 2000, unit: 'sqft', unit_price: 0.08, item_type: 'materials' },
      { name: 'Tear-Off Labor',                qty: 2000, unit: 'sqft', unit_price: 0.68, item_type: 'labor'     },
      { name: 'Roofing Installation Labor',    qty: 2000, unit: 'sqft', unit_price: 1.25, item_type: 'labor'     },
      { name: 'Debris Haul-Away',              qty: 1,    unit: 'ls',   unit_price: 365,  item_type: 'other'     },
      { name: 'Dumpster Rental (3-day)',       qty: 1,    unit: 'ea',   unit_price: 335,  item_type: 'other'     },
    ],
  },
];

// ── Shared icon chip ──────────────────────────────────────────────────────────

function TemplateIcon({ template, size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: template.accentLight,
      color: template.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {template.icon}
    </div>
  );
}

// ── Per-template detail / confirmation modal ──────────────────────────────────

function TemplateDetailModal({ template, hasExistingItems, onConfirm, onClose }) {
  const [mode, setMode] = useState(hasExistingItems ? null : 'replace');

  const materials = template.items.filter(i => i.item_type === 'materials');
  const labor     = template.items.filter(i => i.item_type === 'labor');
  const other     = template.items.filter(i => i.item_type === 'other');
  const baseCost  = template.items.reduce((s, i) => s + i.unit_price * i.qty, 0);

  const ItemSection = ({ title, badge, items }) =>
    items.length > 0 ? (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          <span className={`badge badge-${badge}`}>{title}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px',
              borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'var(--bg)',
            }}>
              <div style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {item.qty.toLocaleString()} {item.unit}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', minWidth: 64, textAlign: 'right' }}>
                @ {fmt(item.unit_price)}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', minWidth: 70, textAlign: 'right' }}>
                {fmt(item.unit_price * item.qty)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500, padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 640,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
            <TemplateIcon template={template} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {template.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 1 }}>{template.subtitle}</div>
                </div>
                <button onClick={onClose} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1,
                  padding: '4px 6px', borderRadius: 'var(--radius)', flexShrink: 0,
                }}>✕</button>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                {template.description}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 999, padding: '4px 10px',
              fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="6" cy="6" r="5"/><path d="M6 3.5v2.5l1.5 1.5"/>
              </svg>
              {template.duration}
            </span>
            <span style={{
              background: template.accentLight, border: `1px solid ${template.accent}30`,
              borderRadius: 999, padding: '4px 10px',
              fontSize: '0.75rem', color: template.accent, fontWeight: 600,
            }}>
              Typical range: {fmtK(template.priceMin)} – {fmtK(template.priceMax)}
            </span>
            <span style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 999, padding: '4px 10px',
              fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500,
            }}>
              {template.items.length} line items
            </span>
          </div>
        </div>

        {/* Item list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '18px 24px' }}>
          <ItemSection title="Materials" badge="materials" items={materials} />
          <ItemSection title="Labor"     badge="labor"     items={labor}     />
          <ItemSection title="Other"     badge="other"     items={other}     />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '2px solid var(--border-dark)', paddingTop: 12, marginTop: 4,
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Base cost (items shown)<br/>
              <span style={{ fontSize: '0.73rem' }}>Typical range reflects full-scope contract pricing</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {fmt(baseCost)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border)',
          flexShrink: 0, background: 'var(--bg)',
        }}>
          {hasExistingItems && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>
                Your quote already has items. How would you like to load this template?
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['replace', 'append'].map(m => (
                  <button key={m} onClick={() => setMode(m)} style={{
                    flex: 1, padding: '8px 12px', borderRadius: 'var(--radius)',
                    border: `2px solid ${mode === m ? 'var(--charcoal)' : 'var(--border)'}`,
                    background: mode === m ? 'var(--charcoal)' : 'var(--surface)',
                    color: mode === m ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                    {m === 'replace' ? 'Replace quote' : 'Add to existing'}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button
              className="btn btn-primary"
              disabled={hasExistingItems && !mode}
              onClick={() => onConfirm(template.items, mode)}
              style={{ flex: 2 }}
            >
              Load {template.items.length} items into quote →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Quick Start modal (all template cards) ────────────────────────────────────

export function QuickStartModal({ open, onClose, hasExistingItems, onLoadTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (!open) { setSelectedTemplate(null); return; }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const handleConfirm = (items, mode) => {
    onLoadTemplate(items, mode);
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 400, padding: 24,
        }}
        onClick={e => { if (e.target === e.currentTarget && !selectedTemplate) onClose(); }}
      >
        <div style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          width: '100%', maxWidth: 900,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}>

          {/* Modal header */}
          <div style={{
            padding: '20px 24px',
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>⚡</span>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Quick Start — Project Templates
                </h2>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Load a complete quote in one click. All prices are El Paso, TX market rates — adjust quantities as needed.
              </p>
            </div>
            <button onClick={onClose} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1,
              padding: '4px 6px', borderRadius: 'var(--radius)', flexShrink: 0, marginLeft: 16,
            }}>✕</button>
          </div>

          {/* Card grid */}
          <div style={{
            overflowY: 'auto', flex: 1,
            padding: 20,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 14,
            alignContent: 'start',
          }}>
            {TEMPLATES.map(template => {
              const baseCost = template.items.reduce((s, i) => s + i.unit_price * i.qty, 0);
              return (
                <div key={template.id} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  borderLeft: `3px solid ${template.accent}`,
                  padding: '16px',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  {/* Card top */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <TemplateIcon template={template} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                        {template.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{template.subtitle}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', margin: 0,
                  }}>
                    {template.description}
                  </p>

                  {/* Chips */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: 999, padding: '3px 8px',
                      fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <circle cx="6" cy="6" r="5"/><path d="M6 3.5v2.5l1.5 1.5"/>
                      </svg>
                      {template.duration}
                    </span>
                    <span style={{
                      background: template.accentLight,
                      borderRadius: 999, padding: '3px 8px',
                      fontSize: '0.7rem', color: template.accent, fontWeight: 600,
                    }}>
                      {fmtK(template.priceMin)} – {fmtK(template.priceMax)}
                    </span>
                    <span style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: 999, padding: '3px 8px',
                      fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500,
                    }}>
                      {template.items.length} items
                    </span>
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: -2,
                  }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      base {fmtK(baseCost)}
                    </span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      Load Template →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedTemplate && (
        <TemplateDetailModal
          template={selectedTemplate}
          hasExistingItems={hasExistingItems}
          onConfirm={handleConfirm}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </>
  );
}
