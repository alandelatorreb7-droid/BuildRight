import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TYPES = ['materials', 'labor', 'other'];

const fmt = (n) => (+n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const emptyForm = {
  category_id: '', name: '', description: '', unit: '',
  unit_price: '', item_type: 'materials', sort_order: '0', is_active: true,
  price_updated_at: '',
};

const getDaysStale = (dateStr) => {
  if (!dateStr) return Infinity;
  return Math.floor((Date.now() - new Date(dateStr)) / 86400000);
};

const PriceAgeBadge = ({ dateStr }) => {
  const days = getDaysStale(dateStr);
  if (days === Infinity) {
    return (
      <span style={{
        background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA',
        borderRadius: 999, padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600,
        whiteSpace: 'nowrap',
      }}>No date</span>
    );
  }
  const label = days < 30 ? `${days}d` : `${Math.floor(days / 30)}mo`;
  if (days >= 180) {
    return (
      <span style={{
        background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA',
        borderRadius: 999, padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600,
        whiteSpace: 'nowrap',
      }}>{label} ago</span>
    );
  }
  if (days >= 90) {
    return (
      <span style={{
        background: '#FFFBEB', color: '#92400E', border: '1px solid #FCD34D',
        borderRadius: 999, padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600,
        whiteSpace: 'nowrap',
      }}>{label} ago</span>
    );
  }
  const d = new Date(dateStr);
  return (
    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
      {d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
    </span>
  );
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const pass = sessionStorage.getItem('adminPass');

  const [items,       setItems]       = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filterCat,   setFilterCat]   = useState('all');
  const [filterStale, setFilterStale] = useState(false);
  const [search,      setSearch]      = useState('');
  const [editItem,    setEditItem]    = useState(null);
  const [form,        setForm]        = useState(emptyForm);
  const [saving,      setSaving]      = useState(false);
  const [msg,         setMsg]         = useState(null);
  const [showForm,    setShowForm]    = useState(false);

  useEffect(() => {
    if (!pass) { navigate('/admin'); return; }
    loadData();
  }, []);

  const headers = { 'x-admin-password': pass, 'Content-Type': 'application/json' };

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([
        fetch('/api/admin/items', { headers }),
        fetch('/api/admin/categories', { headers }),
      ]);
      if (itemsRes.status === 401) { navigate('/admin'); return; }
      setItems(await itemsRes.json());
      setCategories(await catsRes.json());
    } catch {
      flash('error', 'Failed to load data. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const openNew = () => {
    setEditItem(null);
    setForm({ ...emptyForm, category_id: categories[0]?.id || '' });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      category_id: item.category_id,
      name: item.name,
      description: item.description || '',
      unit: item.unit,
      unit_price: item.unit_price,
      item_type: item.item_type,
      sort_order: item.sort_order,
      is_active: item.is_active,
      price_updated_at: item.price_updated_at ? item.price_updated_at.substring(0, 7) : '',
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        unit_price: parseFloat(form.unit_price),
        sort_order: parseInt(form.sort_order) || 0,
        price_updated_at: form.price_updated_at ? form.price_updated_at + '-01' : null,
      };
      const url = editItem ? `/api/admin/items/${editItem.id}` : '/api/admin/items';
      const method = editItem ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      flash('ok', editItem ? 'Item updated.' : 'Item added.');
      setShowForm(false);
      loadData();
    } catch (err) {
      flash('error', 'Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/items/${item.id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error();
      flash('ok', `"${item.name}" deleted.`);
      loadData();
    } catch {
      flash('error', 'Delete failed.');
    }
  };

  const toggleActive = async (item) => {
    try {
      await fetch(`/api/admin/items/${item.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      loadData();
    } catch {
      flash('error', 'Update failed.');
    }
  };

  const staleItems  = items.filter(i => getDaysStale(i.price_updated_at) >= 90);
  const criticalItems = items.filter(i => getDaysStale(i.price_updated_at) >= 180);

  const visible = items.filter(i => {
    const matchCat   = filterCat === 'all' || String(i.category_id) === String(filterCat);
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    const matchStale  = !filterStale || getDaysStale(i.price_updated_at) >= 90;
    return matchCat && matchSearch && matchStale;
  });

  const stats = [
    { label: 'Total Items',  value: items.length,                           color: 'var(--charcoal)' },
    { label: 'Active',       value: items.filter(i => i.is_active).length,  color: '#065F46' },
    { label: 'Inactive',     value: items.filter(i => !i.is_active).length, color: 'var(--rust)' },
    { label: 'Categories',   value: categories.length,                      color: 'var(--amber)' },
    {
      label: 'Needs Update',
      value: staleItems.length,
      color: criticalItems.length > 0 ? 'var(--rust)' : staleItems.length > 0 ? '#B45309' : '#065F46',
      alert: staleItems.length > 0,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{
        background: 'var(--charcoal)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 7,
            background: 'var(--rust)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.8rem', color: '#fff', letterSpacing: '-0.02em',
            flexShrink: 0,
          }}>BR</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.025em' }}>
              BuildRight
            </div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginTop: -2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Admin Panel
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {staleItems.length > 0 && (
            <button
              onClick={() => setFilterStale(f => !f)}
              title={`${staleItems.length} item${staleItems.length !== 1 ? 's' : ''} with prices not updated in 90+ days`}
              style={{
                background: filterStale
                  ? (criticalItems.length > 0 ? 'var(--rust)' : '#D97706')
                  : (criticalItems.length > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'),
                color: filterStale
                  ? '#fff'
                  : (criticalItems.length > 0 ? '#FCA5A5' : '#FCD34D'),
                border: `1px solid ${criticalItems.length > 0 ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.4)'}`,
                borderRadius: 999, padding: '4px 12px',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>⚠</span>
              {staleItems.length} price{staleItems.length !== 1 ? 's' : ''} stale
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ New Item</button>
          <a href="/" style={{
            fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)',
            padding: '6px 12px', borderRadius: 'var(--radius)',
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent'; }}
          >← Estimator</a>
          <button style={{
            fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)',
            padding: '6px 12px', borderRadius: 'var(--radius)', border: 'none',
            background: 'transparent', cursor: 'pointer',
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent'; }}
            onClick={() => { sessionStorage.removeItem('adminPass'); navigate('/admin'); }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Flash message */}
      {msg && (
        <div style={{
          position: 'fixed', top: 72, right: 24, zIndex: 200,
          background: msg.type === 'ok' ? '#F0FFF4' : '#FEF2F2',
          border: `1px solid ${msg.type === 'ok' ? '#A7F3D0' : '#FECACA'}`,
          color: msg.type === 'ok' ? '#065F46' : '#991B1B',
          padding: '11px 18px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)',
          fontSize: '0.875rem', fontWeight: 500,
        }}>
          {msg.type === 'ok' ? '✓ ' : '✕ '}{msg.text}
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.label} onClick={s.label === 'Needs Update' && s.alert ? () => setFilterStale(f => !f) : undefined}
              style={{
                background: s.alert && filterStale ? (criticalItems.length > 0 ? '#FEF2F2' : '#FFFBEB') : 'var(--surface)',
                border: `1px solid ${s.alert ? (criticalItems.length > 0 ? '#FECACA' : '#FCD34D') : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)', padding: '14px 20px', minWidth: 120,
                boxShadow: 'var(--shadow-sm)',
                cursor: s.label === 'Needs Update' && s.alert ? 'pointer' : 'default',
                transition: 'background 0.15s, border-color 0.15s',
              }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 6 }}>
                {s.value}
                {s.alert && <span style={{ fontSize: '1rem' }}>⚠</span>}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="select" style={{ maxWidth: 220 }}
            value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="input" placeholder="Search items…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 280 }} />
          {staleItems.length > 0 && (
            <button
              onClick={() => setFilterStale(f => !f)}
              style={{
                padding: '7px 14px', borderRadius: 'var(--radius)',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                background: filterStale ? '#FEF3C7' : 'var(--surface-2)',
                color: filterStale ? '#92400E' : 'var(--text-muted)',
                border: `1px solid ${filterStale ? '#FCD34D' : 'var(--border)'}`,
                transition: 'all 0.15s',
              }}
            >
              {filterStale ? '✓ ' : ''}Stale only
            </button>
          )}
          <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            {visible.length} item{visible.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading…</div>
        ) : (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            boxShadow: 'var(--shadow)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Category', 'Type', 'Unit', 'Price', 'Price Age', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '11px 16px', textAlign: 'left', fontWeight: 600,
                      fontSize: '0.72rem', color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((item, i) => {
                  const days = getDaysStale(item.price_updated_at);
                  const rowBg = days >= 180
                    ? 'rgba(239,68,68,0.05)'
                    : days >= 90
                      ? 'rgba(245,158,11,0.07)'
                      : i % 2 !== 0 ? 'var(--bg)' : 'transparent';

                  return (
                    <tr key={item.id} style={{
                      borderBottom: '1px solid var(--border)',
                      background: rowBg,
                      opacity: item.is_active ? 1 : 0.45,
                      transition: 'background 0.1s',
                    }}>
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          {days >= 90 && (
                            <span style={{
                              flexShrink: 0, width: 7, height: 7, borderRadius: '50%',
                              background: days >= 180 ? '#EF4444' : '#F59E0B',
                              display: 'inline-block',
                            }} title={days === Infinity ? 'No price date set' : `Price last updated ${days} days ago`} />
                          )}
                          <div>
                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</div>
                            {item.description && (
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2, maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '11px 16px', color: 'var(--text-secondary)', fontSize: '0.845rem' }}>
                        {item.category_name}
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <span className={`badge badge-${item.item_type}`}>{item.item_type}</span>
                      </td>
                      <td style={{ padding: '11px 16px', color: 'var(--text-muted)', fontSize: '0.845rem' }}>{item.unit}</td>
                      <td style={{ padding: '11px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{fmt(item.unit_price)}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <PriceAgeBadge dateStr={item.price_updated_at} />
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <button onClick={() => toggleActive(item)} style={{
                          background: item.is_active ? '#F0FFF4' : '#FEF2F2',
                          color: item.is_active ? '#065F46' : '#991B1B',
                          border: `1px solid ${item.is_active ? '#A7F3D0' : '#FECACA'}`,
                          borderRadius: 999, padding: '3px 10px',
                          fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}>
                          {item.is_active ? 'Active' : 'Hidden'}
                        </button>
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {visible.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    No items match your filters.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / New modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 300, padding: 24,
        }} onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 28,
            width: '100%', maxWidth: 560,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {editItem ? `Edit Item` : 'Add New Item'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1,
                padding: '4px 6px', borderRadius: 'var(--radius)',
              }}>✕</button>
            </div>
            {editItem && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 18, marginTop: -14 }}>
                {editItem.name}
              </div>
            )}
            {editItem && getDaysStale(editItem.price_updated_at) >= 90 && (
              <div style={{
                background: getDaysStale(editItem.price_updated_at) >= 180 ? '#FEF2F2' : '#FFFBEB',
                border: `1px solid ${getDaysStale(editItem.price_updated_at) >= 180 ? '#FECACA' : '#FCD34D'}`,
                color: getDaysStale(editItem.price_updated_at) >= 180 ? '#991B1B' : '#92400E',
                borderRadius: 'var(--radius)', padding: '9px 14px',
                fontSize: '0.8rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>⚠</span>
                <span>
                  Price is {getDaysStale(editItem.price_updated_at) === Infinity
                    ? 'missing a date — please verify and set the "Price Last Updated" field.'
                    : `${Math.floor(getDaysStale(editItem.price_updated_at) / 30)} months old — please verify the price and update the date.`}
                </span>
              </div>
            )}
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Item Name *</label>
                  <input className="input" required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Description</label>
                  <input className="input" placeholder="Optional — shows below item name"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Category *</label>
                  <select className="select" required value={form.category_id}
                    onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">Select…</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Type *</label>
                  <select className="select" value={form.item_type}
                    onChange={e => setForm(f => ({ ...f, item_type: e.target.value }))}>
                    {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Unit Price ($) *</label>
                  <input className="input" type="number" min="0" step="0.01" required
                    value={form.unit_price}
                    onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Unit *</label>
                  <input className="input" required placeholder="e.g. sqft, hr, ea, lf, cy"
                    value={form.unit}
                    onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Display Order</label>
                  <input className="input" type="number"
                    value={form.sort_order}
                    onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Price Last Updated</label>
                  <input className="input" type="month"
                    value={form.price_updated_at}
                    onChange={e => setForm(f => ({ ...f, price_updated_at: e.target.value }))} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 22, gridColumn: '1 / -1' }}>
                  <input type="checkbox" id="is_active" checked={form.is_active}
                    onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                    style={{ width: 16, height: 16, accentColor: 'var(--rust)', cursor: 'pointer' }} />
                  <label htmlFor="is_active" style={{ fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    Active (visible on estimator)
                  </label>
                </div>
              </div>
              <div style={{
                display: 'flex', gap: 8, marginTop: 22, justifyContent: 'flex-end',
                paddingTop: 18, borderTop: '1px solid var(--border)',
              }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
