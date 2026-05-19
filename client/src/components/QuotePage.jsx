import { useState, useEffect } from 'react';
import Header from './Header';
import ConcreteCalculator from './ConcreteCalculator';
import QuoteBuilder from './QuoteBuilder';
import { QuickStartModal } from './ProjectTemplates';

const CATEGORIES = [
  { name: 'All Items',        slug: 'all' },
  { name: 'Materials',        slug: 'materials' },
  { name: 'Labor',            slug: 'labor' },
  { name: 'Concrete',         slug: 'concrete' },
  { name: 'Plumbing',         slug: 'plumbing' },
  { name: 'Electrical',       slug: 'electrical' },
  { name: 'HVAC',             slug: 'hvac' },
  { name: 'Framing',          slug: 'framing' },
  { name: 'Roofing',          slug: 'roofing' },
  { name: 'Finishes',         slug: 'finishes' },
  { name: 'Equipment Rental', slug: 'equipment' },
  { name: 'Permits & Fees',   slug: 'permits' },
];

function CategoryIcon({ slug }) {
  const p = {
    width: 15, height: 15, viewBox: '0 0 15 15', fill: 'none',
    stroke: 'currentColor', strokeWidth: '1.5',
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { flexShrink: 0, display: 'block' },
  };
  switch (slug) {
    case 'all':        return <svg {...p}><rect x="1" y="1" width="5.5" height="5.5" rx="1"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1"/></svg>;
    case 'materials':  return <svg {...p}><rect x="1" y="2" width="5.5" height="3" rx="0.75"/><rect x="8.5" y="2" width="5.5" height="3" rx="0.75"/><rect x="4" y="6.5" width="7" height="3" rx="0.75"/><rect x="1" y="11" width="4.5" height="3" rx="0.75"/><rect x="9.5" y="11" width="4.5" height="3" rx="0.75"/></svg>;
    case 'labor':      return <svg {...p}><circle cx="7.5" cy="4.5" r="2.5"/><path d="M1.5 14.5c0-3.314 2.686-6 6-6s6 2.686 6 6"/></svg>;
    case 'concrete':   return <svg {...p}><rect x="1" y="5.5" width="5.5" height="3.5" rx="1"/><rect x="8.5" y="5.5" width="5.5" height="3.5" rx="1"/><rect x="4" y="1" width="7" height="3" rx="1"/><rect x="2" y="11" width="11" height="3" rx="1"/></svg>;
    case 'plumbing':   return <svg {...p}><path d="M2 2h4v8a3 3 0 0 0 6 0V7h1"/><circle cx="13" cy="6" r="1.5"/></svg>;
    case 'electrical': return <svg {...p}><path d="M8.5 1.5L3 8.5h5L5.5 13.5 13 6.5H8L8.5 1.5z"/></svg>;
    case 'hvac':       return <svg {...p}><circle cx="7.5" cy="7.5" r="5.5"/><path d="M7.5 2.5v10M2.5 7.5h10"/><path d="M4.6 4.6l5.8 5.8M10.4 4.6L4.6 10.4"/></svg>;
    case 'framing':    return <svg {...p}><rect x="1" y="1" width="13" height="13" rx="1"/><rect x="4" y="4" width="7" height="7" rx="0.5"/></svg>;
    case 'roofing':    return <svg {...p}><path d="M1 9.5L7.5 2.5 14 9.5"/><rect x="3" y="9.5" width="9" height="4" rx="1"/><path d="M6.5 9.5v4"/></svg>;
    case 'finishes':   return <svg {...p}><path d="M2.5 12.5l2-2 7-7a1.5 1.5 0 0 0-2.1-2.1l-7 7-2 2.1z"/><path d="M10 3.5l1.5 1.5"/></svg>;
    case 'equipment':  return <svg {...p}><rect x="0.5" y="7.5" width="10" height="5" rx="1"/><path d="M10.5 9.5l3-2-3-2"/><circle cx="3.5" cy="12.5" r="1.5"/><circle cx="7.5" cy="12.5" r="1.5"/></svg>;
    case 'permits':    return <svg {...p}><rect x="2.5" y="0.5" width="10" height="14" rx="1"/><path d="M5.5 5h4"/><path d="M5.5 8h4"/><path d="M5.5 11h2"/></svg>;
    default:           return <svg {...p}><rect x="1" y="1" width="13" height="13" rx="2"/></svg>;
  }
}

const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function QuotePage() {
  const [activeSlug,      setActiveSlug]      = useState('all');
  const [allItems,        setAllItems]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [search,          setSearch]          = useState('');
  const [quoteItems,      setQuoteItems]      = useState(() => {
    try { return JSON.parse(localStorage.getItem('buildright_quote')) || []; } catch { return []; }
  });
  const [windowWidth,     setWindowWidth]     = useState(() => window.innerWidth);
  const [showQuotePanel,  setShowQuotePanel]  = useState(false);
  const [showQuickStart,  setShowQuickStart]  = useState(false);

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (windowWidth >= 1024) setShowQuotePanel(false);
  }, [windowWidth]);

  useEffect(() => {
    if (!showQuickStart) {
      document.body.style.overflow = showQuotePanel ? 'hidden' : '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showQuotePanel, showQuickStart]);

  useEffect(() => {
    localStorage.setItem('buildright_quote', JSON.stringify(quoteItems));
  }, [quoteItems]);

  useEffect(() => {
    fetch('/api/items')
      .then(r => r.json())
      .then(data => { setAllItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const visibleItems = allItems.filter(item => {
    const matchCat    = activeSlug === 'all' || item.category_slug === activeSlug;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToQuote = (item) => {
    setQuoteItems(prev => {
      const existing = prev.find(q => q.id === item.id);
      if (existing) return prev.map(q => q.id === item.id ? { ...q, qty: q.qty + 1 } : q);
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  };

  const removeFromQuote = (id) => setQuoteItems(prev => prev.filter(q => q.id !== id));

  const updateQty = (id, qty) => {
    if (qty <= 0) { removeFromQuote(id); return; }
    setQuoteItems(prev => prev.map(q => q.id === id ? { ...q, qty } : q));
  };

  const updatePrice = (id, price) => {
    setQuoteItems(prev => prev.map(q => q.id === id ? { ...q, unit_price: price } : q));
  };

  const clearQuote = () => {
    if (window.confirm(`Clear all ${quoteItems.length} item${quoteItems.length !== 1 ? 's' : ''} and start a new quote?`)) {
      setQuoteItems([]);
    }
  };

  const loadTemplate = (templateItems, mode) => {
    const mapped = templateItems.map((item, idx) => ({
      ...item,
      id: `tpl-${Date.now()}-${idx}`,
      category_slug: item.category_slug ?? 'custom',
      qty: item.qty ?? 1,
    }));
    setQuoteItems(mode === 'replace' ? mapped : prev => [...prev, ...mapped]);
  };

  const inQuote      = (id)   => quoteItems.some(q => q.id === id);
  const quoteTotal   = quoteItems.reduce((s, i) => s + i.unit_price * i.qty, 0);
  const hasItems     = quoteItems.length > 0;
  const showConcCalc = activeSlug === 'concrete' || activeSlug === 'all';

  const categoryCounts = allItems.reduce((acc, item) => {
    acc[item.category_slug] = (acc[item.category_slug] || 0) + 1;
    return acc;
  }, {});

  const isNarrow = windowWidth < 1024;

  // ── Quick Start button — shared style ────────────────────────────────────────
  const QuickStartBtn = ({ style = {} }) => (
    <button
      onClick={() => setShowQuickStart(true)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '5px 11px', borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        background: 'var(--surface-2)', color: 'var(--text-secondary)',
        fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s, color 0.15s',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--charcoal)';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.borderColor = 'var(--charcoal)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--surface-2)';
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      ⚡ Quick Start
    </button>
  );

  // ── Quote panel (shared between desktop and mobile bottom sheet) ─────────────
  const quotePanelContent = (
    <>
      <div style={{
        padding: '13px 18px',
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            Your Quote
          </span>
          {hasItems && (
            <span style={{
              background: 'var(--charcoal)', color: '#fff',
              borderRadius: 999, padding: '1px 7px', fontSize: '0.72rem', fontWeight: 700,
              flexShrink: 0,
            }}>{quoteItems.length}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <QuickStartBtn />
          {hasItems && (
            <button
              onClick={clearQuote}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: '0.75rem', color: 'var(--text-muted)',
                padding: '3px 7px', borderRadius: 'var(--radius)',
                transition: 'color 0.15s, background 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--rust)'; e.currentTarget.style.background = '#FEF2F2'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              New quote
            </button>
          )}
          {hasItems && (
            <span style={{ fontWeight: 700, color: 'var(--rust)', fontSize: '0.92rem', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              {fmt(quoteTotal)}
            </span>
          )}
          {isNarrow && (
            <button
              onClick={() => setShowQuotePanel(false)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1,
                padding: '4px 6px', borderRadius: 'var(--radius)',
              }}
            >✕</button>
          )}
        </div>
      </div>
      <div style={{ padding: 18, overflowY: 'auto', flex: 1 }}>
        <QuoteBuilder
          quoteItems={quoteItems}
          onRemove={removeFromQuote}
          onQtyChange={updateQty}
          onPriceChange={updatePrice}
          onAdd={addToQuote}
        />
      </div>
    </>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* ── Narrow: sticky horizontal category bar ── */}
      {isNarrow && (
        <div className="no-print hide-scrollbar" style={{
          position: 'sticky', top: 60, zIndex: 90,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
          display: 'flex', gap: 6,
          padding: '9px 16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {CATEGORIES.map(cat => {
            const active = activeSlug === cat.slug;
            const count = cat.slug === 'all' ? allItems.length : (categoryCounts[cat.slug] || 0);
            return (
              <button key={cat.slug}
                onClick={() => { setActiveSlug(cat.slug); setSearch(''); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 11px', borderRadius: 999,
                  border: `1px solid ${active ? 'var(--charcoal)' : 'var(--border)'}`,
                  background: active ? 'var(--charcoal)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.8rem', fontWeight: active ? 600 : 400,
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'background 0.12s, border-color 0.12s, color 0.12s',
                }}
              >
                <span style={{ opacity: active ? 1 : 0.6, display: 'flex' }}><CategoryIcon slug={cat.slug} /></span>
                {cat.name}
                {!loading && count > 0 && (
                  <span style={{ fontSize: '0.68rem', fontWeight: 500, color: active ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)' }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Desktop: sub-header ── */}
      {!isNarrow && (
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '16px 24px' }} className="no-print">
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, letterSpacing: '-0.02em' }}>
              Construction Cost Estimator
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              El Paso, TX — 2024/2025 pricing. Browse categories, build your quote, and adjust your margin.
            </p>
          </div>
        </div>
      )}

      {/* ── Main layout ── */}
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: isNarrow ? '16px 16px' : '24px',
        paddingBottom: isNarrow ? 88 : 24,
        width: '100%', flex: 1,
      }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* ── Desktop sidebar ── */}
          {!isNarrow && (
            <aside style={{
              width: 210, flexShrink: 0, position: 'sticky', top: 76,
              alignSelf: 'flex-start',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '10px 8px',
              boxShadow: 'var(--shadow)',
            }} className="no-print">
              <div style={{
                fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.09em',
                marginBottom: 8, padding: '0 8px',
              }}>
                Categories
              </div>
              {CATEGORIES.map(cat => {
                const active = activeSlug === cat.slug;
                const count = cat.slug === 'all' ? allItems.length : (categoryCounts[cat.slug] || 0);
                return (
                  <button key={cat.slug}
                    onClick={() => { setActiveSlug(cat.slug); setSearch(''); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                      padding: '8px 10px', borderRadius: 'var(--radius)', border: 'none',
                      background: active ? 'var(--charcoal)' : 'transparent',
                      color: active ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.845rem', fontWeight: active ? 600 : 400,
                      cursor: 'pointer', textAlign: 'left', marginBottom: 1,
                      transition: 'background 0.12s, color 0.12s',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                  >
                    <span style={{ opacity: active ? 1 : 0.65, display: 'flex' }}><CategoryIcon slug={cat.slug} /></span>
                    <span style={{ flex: 1 }}>{cat.name}</span>
                    {!loading && count > 0 && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 500, color: active ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)', minWidth: 18, textAlign: 'right' }}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </aside>
          )}

          {/* ── Main content ── */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 16 }} className="no-print">
              <input className="input" placeholder="Search items..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: '#fff' }} />
            </div>

            {showConcCalc && (
              <ConcreteCalculator
                onAddCuYard={(cuYd) => {
                  const concreteItem = allItems.find(i => i.name.includes('3000 PSI'));
                  if (concreteItem) {
                    setQuoteItems(prev => {
                      const existing = prev.find(q => q.id === concreteItem.id);
                      if (existing) return prev.map(q => q.id === concreteItem.id ? { ...q, qty: +(q.qty + cuYd).toFixed(2) } : q);
                      return [...prev, { ...concreteItem, qty: +cuYd.toFixed(2) }];
                    });
                  }
                }}
              />
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading prices…</div>
            ) : visibleItems.length === 0 ? (
              search || activeSlug !== 'all'
                ? <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', fontSize: '0.9rem' }}>No items found.</div>
                : null
            ) : (
              <>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  {visibleItems.length} item{visibleItems.length !== 1 ? 's' : ''}
                  {activeSlug !== 'all' && ` in ${CATEGORIES.find(c => c.slug === activeSlug)?.name}`}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                  {visibleItems.map(item => (
                    <ItemCard key={item.id} item={item} added={inQuote(item.id)} onAdd={() => addToQuote(item)} />
                  ))}
                </div>
              </>
            )}
          </main>

          {/* ── Desktop: quote panel ── */}
          {!isNarrow && (
            <aside style={{ width: 390, flexShrink: 0 }} className="no-print">
              <div style={{
                position: 'sticky', top: 76,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'flex', flexDirection: 'column',
                maxHeight: 'calc(100vh - 100px)',
              }}>
                {quotePanelContent}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ── Narrow: fixed bottom quote bar ── */}
      {isNarrow && (
        <div className="no-print" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'var(--charcoal)', padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 -2px 16px rgba(0,0,0,0.2)', gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              Your Quote
              {hasItems && (
                <span style={{ background: 'var(--rust)', color: '#fff', borderRadius: 999, padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>
                  {quoteItems.length}
                </span>
              )}
            </div>
            {hasItems ? (
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', marginTop: 1 }}>{fmt(quoteTotal)}</div>
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: 1 }}>No items yet</div>
            )}
          </div>
          {!hasItems && (
            <button
              onClick={() => setShowQuickStart(true)}
              style={{
                background: 'rgba(255,255,255,0.12)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--radius)', padding: '8px 14px',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              ⚡ Quick Start
            </button>
          )}
          <button
            onClick={() => setShowQuotePanel(true)}
            style={{
              background: 'var(--rust)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)',
              padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600,
              cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--rust-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--rust)'; }}
          >
            {hasItems ? 'View Quote' : 'Build Quote'}
          </button>
        </div>
      )}

      {/* ── Narrow: quote panel bottom sheet overlay ── */}
      {isNarrow && showQuotePanel && (
        <div className="no-print" style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowQuotePanel(false); }}
        >
          <div className="slide-up" style={{
            background: 'var(--surface)', borderRadius: '14px 14px 0 0',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-dark)' }} />
            </div>
            {quotePanelContent}
          </div>
        </div>
      )}

      {/* ── Quick Start modal ── */}
      <QuickStartModal
        open={showQuickStart}
        onClose={() => setShowQuickStart(false)}
        hasExistingItems={hasItems}
        onLoadTemplate={loadTemplate}
      />
    </div>
  );
}

function fmtPriceDate(dateStr) {
  if (!dateStr) return null;
  const [year, month] = dateStr.split('-').map(Number);
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function ItemCard({ item, added, onAdd }) {
  const badgeClass = `badge badge-${item.item_type}`;
  const typeLabel  = item.item_type.charAt(0).toUpperCase() + item.item_type.slice(1);
  const priceDate  = fmtPriceDate(item.price_updated_at);

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${added ? '#FCA5A5' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)', padding: '13px 15px',
      display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'border-color 0.15s, box-shadow 0.15s',
      boxShadow: added ? '0 0 0 3px rgba(192,57,43,0.07)' : 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.35, color: 'var(--text-primary)' }}>{item.name}</div>
          {item.description && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>{item.description}</div>
          )}
        </div>
        <span className={badgeClass}>{typeLabel}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
            {(+item.unit_price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 4 }}>/ {item.unit}</span>
        </div>
        <button className={`btn btn-sm ${added ? 'btn-secondary' : 'btn-primary'}`} onClick={onAdd} style={{ minWidth: 72 }}>
          {added ? '✓ Added' : '+ Add'}
        </button>
      </div>
      {priceDate && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 7, marginTop: -2 }}>
          Updated: {priceDate}
        </div>
      )}
    </div>
  );
}
