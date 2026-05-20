import { useState, useEffect, useRef } from 'react';

const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const COMMON_UNITS = ['ea', 'hr', 'sqft', 'lf', 'cy', 'ton', 'lb', 'day', 'wk', 'ls'];
const TYPES = [
  { value: 'materials', label: 'Materials' },
  { value: 'labor',     label: 'Labor'     },
  { value: 'other',     label: 'Other'     },
];

const EMPTY_CUSTOM = { name: '', qty: '1', unit: 'ea', price: '', type: 'other' };

// ── Inline-editable unit price ────────────────────────────────────────────────

function PriceInput({ item, onPriceChange }) {
  const [focused, setFocused]   = useState(false);
  const [hovered, setHovered]   = useState(false);
  const [rawVal,  setRawVal]    = useState('');
  const inputRef                = useRef(null);

  const handleFocus = () => {
    setRawVal(String(item.unit_price));
    setFocused(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleBlur = () => {
    const p = parseFloat(rawVal);
    if (p > 0 && p !== item.unit_price) onPriceChange(item.id, p);
    setFocused(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') { e.target.blur(); }
    if (e.key === 'Escape') { setFocused(false); setRawVal(''); e.target.blur(); }
  };

  const borderColor = focused
    ? 'var(--charcoal)'
    : hovered
      ? 'var(--border-dark)'
      : 'transparent';

  return (
    <input
      ref={inputRef}
      type="text"
      value={focused ? rawVal : fmt(item.unit_price)}
      onChange={e => setRawVal(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Click to edit price"
      style={{
        border: 'none',
        borderBottom: `1.5px ${focused ? 'solid' : 'dashed'} ${borderColor}`,
        background: focused ? 'var(--bg)' : 'transparent',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontFamily: 'var(--font)',
        width: focused ? 80 : 72,
        padding: focused ? '1px 4px' : '1px 2px',
        borderRadius: focused ? '3px 3px 0 0' : 0,
        cursor: 'text',
        outline: 'none',
        transition: 'border-color 0.15s, background 0.15s, width 0.1s',
        textAlign: 'left',
      }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function QuoteBuilder({
  quoteItems, onRemove, onQtyChange, onPriceChange, onAdd,
  projectName, onProjectNameChange,
  clientName,  onClientNameChange,
  margin,      onMarginChange,
  notes,       onNotesChange,
  estimateNo,  onEstimateNoChange,
}) {
  const [contractor, setContractor] = useState(() => {
    try { return JSON.parse(localStorage.getItem('buildright_contractor') || '{}'); }
    catch { return {}; }
  });
  const [showContractor, setShowContractor] = useState(!contractor.companyName);
  const updateContractor = (key, val) => setContractor(c => ({ ...c, [key]: val }));

  useEffect(() => {
    localStorage.setItem('buildright_contractor', JSON.stringify(contractor));
  }, [contractor]);

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [custom,         setCustom]         = useState(EMPTY_CUSTOM);
  const [customError,    setCustomError]    = useState('');

  const updateCustom = (key, val) => {
    setCustom(c => ({ ...c, [key]: val }));
    if (customError) setCustomError('');
  };

  const handleAddCustom = () => {
    const price = parseFloat(custom.price);
    const qty   = parseFloat(custom.qty) || 1;
    if (!custom.name.trim())  { setCustomError('Item name is required.'); return; }
    if (!(price > 0))         { setCustomError('Enter a valid unit price greater than 0.'); return; }

    onAdd({
      id:            `custom-${Date.now()}`,
      name:          custom.name.trim(),
      description:   '',
      unit:          custom.unit.trim() || 'ea',
      unit_price:    price,
      item_type:     custom.type,
      category_slug: 'custom',
      qty,
    });

    setCustom(c => ({ ...c, name: '', qty: '1', price: '' }));
    setCustomError('');
  };

  const handleCustomKey = (e) => { if (e.key === 'Enter') handleAddCustom(); };

  const materials = quoteItems.filter(i => i.item_type === 'materials');
  const labor     = quoteItems.filter(i => i.item_type === 'labor');
  const other     = quoteItems.filter(i => i.item_type === 'other');

  const sub    = (items) => items.reduce((s, i) => s + i.unit_price * i.qty, 0);
  const matSub = sub(materials);
  const labSub = sub(labor);
  const othSub = sub(other);
  const base   = matSub + labSub + othSub;
  const profit = base * (margin / 100);
  const total  = base + profit;

  const hasItems = quoteItems.length > 0;

  const handleDownloadPDF = async () => {
    const { generatePDF } = await import('../utils/generatePDF');

    let usedEstimateNo = estimateNo;
    if (!usedEstimateNo) {
      const now = new Date();
      usedEstimateNo = `EST-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      onEstimateNoChange(usedEstimateNo);
    }

    generatePDF({
      projectName, clientName,
      companyName:       contractor.companyName  || '',
      contractorPhone:   contractor.phone        || '',
      contractorEmail:   contractor.email        || '',
      contractorLicense: contractor.license      || '',
      materials, labor, other,
      matSub, labSub, othSub,
      base, margin, profit, total,
      notes,
      estimateNo: usedEstimateNo,
    });
  };

  const handleCopy = async () => {
    const lines = [
      `BuildRight Estimate — ${projectName || 'Project'}`,
      `Client: ${clientName || '—'}`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      '--- MATERIALS ---',
      ...materials.map(i => `  ${i.name} (${i.qty} ${i.unit}) — ${fmt(i.unit_price * i.qty)}`),
      `  Subtotal: ${fmt(matSub)}`,
      '',
      '--- LABOR ---',
      ...labor.map(i => `  ${i.name} (${i.qty} ${i.unit}) — ${fmt(i.unit_price * i.qty)}`),
      `  Subtotal: ${fmt(labSub)}`,
      '',
      '--- OTHER ---',
      ...other.map(i => `  ${i.name} (${i.qty} ${i.unit}) — ${fmt(i.unit_price * i.qty)}`),
      `  Subtotal: ${fmt(othSub)}`,
      '',
      `Base Cost: ${fmt(base)}`,
      `Profit / Overhead (${margin}%): ${fmt(profit)}`,
      `TOTAL ESTIMATE: ${fmt(total)}`,
      ...(notes ? ['', '--- NOTES ---', notes] : []),
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    alert('Quote copied to clipboard!');
  };

  const Section = ({ title, badge, items, sectionSub, isFirst }) => (
    items.length > 0 ? (
      <div style={{ marginBottom: 24, marginTop: isFirst ? 0 : 8 }}>

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 9, paddingBottom: 7,
          borderBottom: '1px solid var(--border)',
        }}>
          <span className={`badge badge-${badge}`}>{title}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Item list — grouped card with dividers */}
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {items.map((item, idx) => (
            <div key={item.id} style={{
              padding: '11px 14px',
              borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
            }}>

              {/* Row 1 — name + line total */}
              <div style={{
                display: 'flex', alignItems: 'baseline',
                justifyContent: 'space-between', gap: 10, marginBottom: 7,
              }}>
                <div style={{
                  fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)',
                  flex: 1, minWidth: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {fmt(item.unit_price * item.qty)}
                </div>
              </div>

              {/* Row 2 — qty controls · unit price · delete */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>

                <button className="btn btn-ghost btn-sm"
                  onClick={() => onQtyChange(item.id, Math.max(0.1, +(item.qty - 1).toFixed(2)))}
                  style={{ padding: '2px 7px', minWidth: 26, height: 26, lineHeight: 1, flexShrink: 0 }}>−</button>

                <input
                  type="number" min="0.01" step="0.01"
                  value={item.qty}
                  onChange={e => onQtyChange(item.id, Math.max(0.01, parseFloat(e.target.value) || 0))}
                  style={{
                    width: 54, textAlign: 'center', padding: '2px 4px', height: 26,
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', color: 'var(--text-primary)',
                    fontSize: '0.82rem', fontFamily: 'var(--font)', flexShrink: 0,
                  }} />

                <button className="btn btn-ghost btn-sm"
                  onClick={() => onQtyChange(item.id, +(item.qty + 1).toFixed(2))}
                  style={{ padding: '2px 7px', minWidth: 26, height: 26, lineHeight: 1, flexShrink: 0 }}>+</button>

                <span style={{
                  fontSize: '0.75rem', color: 'var(--text-muted)',
                  marginLeft: 2, flexShrink: 0,
                }}>{item.unit}</span>

                <span style={{ fontSize: '0.68rem', color: 'var(--border-dark)', margin: '0 1px', flexShrink: 0 }}>·</span>

                <PriceInput item={item} onPriceChange={onPriceChange} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>/{item.unit}</span>

                {item.category_slug === 'custom' && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--amber)', fontWeight: 600, flexShrink: 0 }}>custom</span>
                )}

                <div style={{ flex: 1 }} />

                <button
                  onClick={() => onRemove(item.id)}
                  title="Remove item"
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1,
                    padding: '3px 5px', borderRadius: 'var(--radius)', flexShrink: 0,
                    transition: 'color 0.12s, background 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--rust)'; e.currentTarget.style.background = '#FEF2F2'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                >✕</button>

              </div>
            </div>
          ))}
        </div>

        {/* Section subtotal */}
        <div style={{ textAlign: 'right', marginTop: 7, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Subtotal: <strong style={{ color: 'var(--text-primary)' }}>{fmt(sectionSub)}</strong>
        </div>

      </div>
    ) : null
  );

  return (
    <div>

      {/* ── Contractor info ── */}
      <div style={{
        marginBottom: 18,
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }} className="no-print">
        <button
          onClick={() => setShowContractor(s => !s)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Your Company
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {!showContractor && contractor.companyName && (
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{contractor.companyName}</span>
            )}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              style={{ transform: showContractor ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </span>
        </button>
        {showContractor && (
          <div style={{ padding: '0 14px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Company Name</label>
              <input className="input" placeholder="Smith Construction LLC"
                value={contractor.companyName || ''} onChange={e => updateContractor('companyName', e.target.value)} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="(915) 555-0100"
                value={contractor.phone || ''} onChange={e => updateContractor('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" placeholder="info@company.com"
                value={contractor.email || ''} onChange={e => updateContractor('email', e.target.value)} />
            </div>
            <div>
              <label className="label">License #</label>
              <input className="input" placeholder="TX-GC-12345"
                value={contractor.license || ''} onChange={e => updateContractor('license', e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* ── Project / client info ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }} className="no-print">
        <div style={{ flex: 1, minWidth: 150 }}>
          <label className="label">Project Name</label>
          <input className="input" placeholder="Smith Residence Addition"
            value={projectName} onChange={e => onProjectNameChange(e.target.value)} />
        </div>
        <div style={{ flex: 1, minWidth: 150 }}>
          <label className="label">Client / Contact</label>
          <input className="input" placeholder="John Smith"
            value={clientName} onChange={e => onClientNameChange(e.target.value)} />
        </div>
      </div>

      {/* ── Items ── */}
      {hasItems ? (
        <>
          <Section title="Materials" badge="materials" items={materials} sectionSub={matSub} isFirst={true} />
          <Section title="Labor"     badge="labor"     items={labor}     sectionSub={labSub} isFirst={!materials.length} />
          <Section title="Other"     badge="other"     items={other}     sectionSub={othSub} isFirst={!materials.length && !labor.length} />
        </>
      ) : (
        <div style={{
          padding: '20px 0 16px', textAlign: 'center',
          color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ display: 'block', margin: '0 auto 10px', opacity: 0.3 }}>
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <path d="M8 7h8M8 11h8M8 15h4"/>
          </svg>
          Browse categories on the left and click <strong>Add</strong>,<br/>or add a custom item below.
        </div>
      )}

      {/* ── Add Custom Item ── */}
      <div className="no-print" style={{ marginBottom: hasItems ? 16 : 0 }}>
        {!showCustomForm ? (
          <button
            onClick={() => setShowCustomForm(true)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '9px 14px',
              background: 'var(--bg)', border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)',
              transition: 'border-color 0.15s, color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-dark)';
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'var(--surface-2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'var(--bg)';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M6.5 1v11M1 6.5h11"/>
            </svg>
            Add Custom Item
          </button>
        ) : (
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '9px 14px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Custom Item
              </span>
              <button
                onClick={() => { setShowCustomForm(false); setCustom(EMPTY_CUSTOM); setCustomError(''); }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1,
                  padding: '2px 5px', borderRadius: 'var(--radius)',
                }}
              >✕</button>
            </div>

            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Row 1: name + type */}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="input"
                  placeholder="Item description"
                  value={custom.name}
                  onChange={e => updateCustom('name', e.target.value)}
                  onKeyDown={handleCustomKey}
                  style={{ flex: 1 }}
                  autoFocus
                />
                <select
                  className="select"
                  value={custom.type}
                  onChange={e => updateCustom('type', e.target.value)}
                  style={{ width: 102, flexShrink: 0 }}
                >
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {/* Row 2: qty + unit + price + add */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <label className="label" style={{ marginBottom: 0 }}>Qty</label>
                  <input
                    className="input"
                    type="number" min="0.01" step="any"
                    placeholder="1"
                    value={custom.qty}
                    onChange={e => updateCustom('qty', e.target.value)}
                    onKeyDown={handleCustomKey}
                    style={{ width: 54 }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <label className="label" style={{ marginBottom: 0 }}>Unit</label>
                  <input
                    className="input"
                    list="unit-suggestions"
                    placeholder="ea"
                    value={custom.unit}
                    onChange={e => updateCustom('unit', e.target.value)}
                    onKeyDown={handleCustomKey}
                    style={{ width: 70 }}
                  />
                  <datalist id="unit-suggestions">
                    {COMMON_UNITS.map(u => <option key={u} value={u} />)}
                  </datalist>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                  <label className="label" style={{ marginBottom: 0 }}>Unit Price</label>
                  <input
                    className="input"
                    type="number" min="0" step="0.01"
                    placeholder="0.00"
                    value={custom.price}
                    onChange={e => updateCustom('price', e.target.value)}
                    onKeyDown={handleCustomKey}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <label className="label" style={{ marginBottom: 0, visibility: 'hidden' }}>Add</label>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddCustom}
                    style={{ padding: '9px 14px', whiteSpace: 'nowrap' }}
                  >
                    + Add
                  </button>
                </div>
              </div>

              {customError && (
                <div style={{
                  fontSize: '0.78rem', color: '#991B1B',
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: 'var(--radius)', padding: '6px 10px',
                }}>
                  {customError}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Margin, totals, actions ── */}
      {hasItems && (
        <>
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
            padding: 16, marginBottom: 16,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }} className="no-print">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Profit / Overhead Margin</label>
              <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '1rem' }}>{margin}%</span>
            </div>
            <input type="range" min="0" max="50" step="1" value={margin}
              onChange={e => onMarginChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--charcoal)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>0%</span><span>25%</span><span>50%</span>
            </div>
          </div>

          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 18,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Materials</span>
                <span style={{ color: 'var(--text-secondary)' }}>{fmt(matSub)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Labor</span>
                <span style={{ color: 'var(--text-secondary)' }}>{fmt(labSub)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Other</span>
                <span style={{ color: 'var(--text-secondary)' }}>{fmt(othSub)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 9, display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Base Cost</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{fmt(base)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--amber)', fontWeight: 500 }}>Margin ({margin}%)</span>
                <span style={{ color: 'var(--amber)', fontWeight: 500 }}>{fmt(profit)}</span>
              </div>
              <div style={{
                borderTop: '2px solid var(--border-dark)', paddingTop: 11, marginTop: 2,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Total Estimate</span>
                <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--rust)', letterSpacing: '-0.02em' }}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }} className="no-print">
            <label className="label">Notes / Payment Terms</label>
            <textarea
              className="input"
              placeholder="e.g. This estimate is valid for 30 days. Payment: 50% deposit upon signing, balance on completion."
              value={notes}
              onChange={e => onNotesChange(e.target.value)}
              rows={3}
              style={{ resize: 'vertical', lineHeight: 1.5, minHeight: 72 }}
            />
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3 }}>
              Appears on the PDF export
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }} className="no-print">
            <button className="btn btn-primary btn-lg" onClick={handleDownloadPDF} style={{ flex: 1 }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.5 1v9M4 7l3.5 3.5L11 7"/><path d="M1 11v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2"/>
              </svg>
              Download PDF
            </button>
            <button className="btn btn-secondary btn-lg" onClick={handleCopy} style={{ flex: 1 }}>
              Copy to Clipboard
            </button>
          </div>
        </>
      )}
    </div>
  );
}
