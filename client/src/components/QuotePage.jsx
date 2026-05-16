import { useState, useEffect } from 'react';
import Header from './Header';
import ConcreteCalculator from './ConcreteCalculator';
import QuoteBuilder from './QuoteBuilder';

const CATEGORIES = [
  { name: 'All Items',        slug: 'all',       icon: '📦' },
  { name: 'Materials',        slug: 'materials',  icon: '🧱' },
  { name: 'Labor',            slug: 'labor',      icon: '👷' },
  { name: 'Concrete',         slug: 'concrete',   icon: '🏗️' },
  { name: 'Plumbing',         slug: 'plumbing',   icon: '🔧' },
  { name: 'Electrical',       slug: 'electrical', icon: '⚡' },
  { name: 'HVAC',             slug: 'hvac',       icon: '❄️' },
  { name: 'Framing',          slug: 'framing',    icon: '🪵' },
  { name: 'Roofing',          slug: 'roofing',    icon: '🏠' },
  { name: 'Finishes',         slug: 'finishes',   icon: '🎨' },
  { name: 'Equipment Rental', slug: 'equipment',  icon: '🚜' },
  { name: 'Permits & Fees',   slug: 'permits',    icon: '📋' },
];

const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function QuotePage() {
  const [activeSlug, setActiveSlug]   = useState('all');
  const [allItems, setAllItems]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [quoteItems, setQuoteItems]   = useState([]);
  const [showQuote, setShowQuote]     = useState(false);

  useEffect(() => {
    fetch('/api/items')
      .then(r => r.json())
      .then(data => { setAllItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const visibleItems = allItems.filter(item => {
    const matchCat = activeSlug === 'all' || item.category_slug === activeSlug;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToQuote = (item) => {
    setQuoteItems(prev => {
      const existing = prev.find(q => q.id === item.id);
      if (existing) return prev.map(q => q.id === item.id ? { ...q, qty: q.qty + 1 } : q);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromQuote = (id) => setQuoteItems(prev => prev.filter(q => q.id !== id));

  const updateQty = (id, qty) => {
    if (qty <= 0) { removeFromQuote(id); return; }
    setQuoteItems(prev => prev.map(q => q.id === id ? { ...q, qty } : q));
  };

  const inQuote = (id) => quoteItems.some(q => q.id === id);
  const quoteTotal = quoteItems.reduce((s, i) => s + i.unit_price * i.qty, 0);

  const showConcreteCalc = activeSlug === 'concrete' || activeSlug === 'all';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--blue-mid) 0%, var(--blue-dark) 100%)',
        borderBottom: '1px solid var(--border)', padding: '28px 24px',
      }} className="no-print">
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
            Construction Cost Estimator
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            El Paso, TX — 2024/2025 pricing. Browse items, build your quote, adjust margin.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px', width: '100%', flex: 1 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* ── Sidebar: Category nav ── */}
          <aside style={{ width: 220, flexShrink: 0, position: 'sticky', top: 80 }} className="no-print">
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, padding: '0 8px' }}>
              Categories
            </div>
            {CATEGORIES.map(cat => (
              <button key={cat.slug}
                onClick={() => { setActiveSlug(cat.slug); setSearch(''); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 'var(--radius)', border: 'none',
                  background: activeSlug === cat.slug ? 'var(--rust)' : 'transparent',
                  color: activeSlug === cat.slug ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.875rem', fontWeight: activeSlug === cat.slug ? 600 : 400,
                  cursor: 'pointer', textAlign: 'left', marginBottom: 2,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { if (activeSlug !== cat.slug) e.currentTarget.style.background = 'var(--surface)'; }}
                onMouseLeave={e => { if (activeSlug !== cat.slug) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </aside>

          {/* ── Main content ── */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Search */}
            <div style={{ marginBottom: 16 }} className="no-print">
              <input className="input" placeholder="🔍  Search items..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Concrete calculator */}
            {showConcreteCalc && (
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

            {/* Items grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)' }}>Loading prices...</div>
            ) : visibleItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>No items found.</div>
            ) : (
              <>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  {visibleItems.length} item{visibleItems.length !== 1 ? 's' : ''}
                  {activeSlug !== 'all' && ` in ${CATEGORIES.find(c => c.slug === activeSlug)?.name}`}
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 12,
                }}>
                  {visibleItems.map(item => (
                    <ItemCard key={item.id} item={item}
                      added={inQuote(item.id)}
                      onAdd={() => addToQuote(item)} />
                  ))}
                </div>
              </>
            )}
          </main>

          {/* ── Quote panel ── */}
          <aside style={{ width: 400, flexShrink: 0 }} className="no-print">
            <div style={{
              position: 'sticky', top: 80,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            }}>
              <div style={{
                padding: '14px 20px',
                background: 'var(--surface-2)',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>Your Quote</span>
                  {quoteItems.length > 0 && (
                    <span style={{
                      background: 'var(--rust)', color: '#fff',
                      borderRadius: 999, padding: '1px 7px', fontSize: '0.75rem', fontWeight: 700,
                    }}>{quoteItems.length}</span>
                  )}
                </div>
                {quoteItems.length > 0 && (
                  <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '0.95rem' }}>
                    {fmt(quoteTotal)}
                  </span>
                )}
              </div>
              <div style={{ padding: 20, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <QuoteBuilder
                  quoteItems={quoteItems}
                  onRemove={removeFromQuote}
                  onQtyChange={updateQty}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ItemCard({ item, added, onAdd }) {
  const badgeClass = `badge badge-${item.item_type}`;
  const typeLabel = item.item_type.charAt(0).toUpperCase() + item.item_type.slice(1);

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${added ? 'var(--rust)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
      transition: 'border-color 0.15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: '0.88rem', lineHeight: 1.3 }}>{item.name}</div>
          {item.description && (
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>
              {item.description}
            </div>
          )}
        </div>
        <span className={badgeClass}>{typeLabel}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
            {(+item.unit_price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 4 }}>/ {item.unit}</span>
        </div>
        <button
          className={`btn btn-sm ${added ? 'btn-secondary' : 'btn-primary'}`}
          onClick={onAdd}
          style={{ minWidth: 70 }}
        >
          {added ? '✓ Added' : '+ Add'}
        </button>
      </div>
    </div>
  );
}
