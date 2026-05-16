import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TYPES = ['materials', 'labor', 'other'];

const fmt = (n) => (+n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const emptyForm = {
  category_id: '', name: '', description: '', unit: '',
  unit_price: '', item_type: 'materials', sort_order: '0', is_active: true,
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const pass = sessionStorage.getItem('adminPass');

  const [items,      setItems]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filterCat,  setFilterCat]  = useState('all');
  const [search,     setSearch]     = useState('');
  const [editItem,   setEditItem]   = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [saving,     setSaving]     = useState(false);
  const [msg,        setMsg]        = useState(null);
  const [showForm,   setShowForm]   = useState(false);

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

  const visible = items.filter(i => {
    const matchCat = filterCat === 'all' || String(i.category_id) === String(filterCat);
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--blue-dark)' }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--blue-mid)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>🏗️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              Build<span style={{ color: 'var(--rust)' }}>Right</span> Admin
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Price Management</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={openNew}>+ New Item</button>
          <a href="/" className="btn btn-ghost btn-sm">← Back to App</a>
          <button className="btn btn-ghost btn-sm"
            onClick={() => { sessionStorage.removeItem('adminPass'); navigate('/admin'); }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Flash message */}
      {msg && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 200,
          background: msg.type === 'ok' ? '#1a3a20' : '#3a1010',
          border: `1px solid ${msg.type === 'ok' ? '#27ae60' : '#e74c3c'}`,
          color: msg.type === 'ok' ? '#6fcf97' : '#e74c3c',
          padding: '12px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
          fontSize: '0.88rem', fontWeight: 500,
        }}>
          {msg.type === 'ok' ? '✓ ' : '✕ '}{msg.text}
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Items', value: items.length, color: 'var(--blue-muted)' },
            { label: 'Active', value: items.filter(i => i.is_active).length, color: '#27ae60' },
            { label: 'Inactive', value: items.filter(i => !i.is_active).length, color: '#e74c3c' },
            { label: 'Categories', value: categories.length, color: 'var(--gold)' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '14px 20px', minWidth: 120,
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <select className="select" style={{ maxWidth: 220 }}
            value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <input className="input" placeholder="🔍  Search items..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300 }} />
          <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem', alignSelf: 'center' }}>
            {visible.length} item{visible.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)' }}>Loading...</div>
        ) : (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Category', 'Type', 'Unit', 'Price', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left', fontWeight: 600,
                      fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((item, i) => (
                  <tr key={item.id} style={{
                    borderBottom: '1px solid var(--border)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    opacity: item.is_active ? 1 : 0.5,
                  }}>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      {item.description && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '11px 16px', color: 'var(--text-muted)' }}>
                      {item.category_name}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span className={`badge badge-${item.item_type}`}>{item.item_type}</span>
                    </td>
                    <td style={{ padding: '11px 16px', color: 'var(--text-muted)' }}>{item.unit}</td>
                    <td style={{ padding: '11px 16px', fontWeight: 600 }}>{fmt(item.unit_price)}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <button onClick={() => toggleActive(item)}
                        style={{
                          background: item.is_active ? '#1a3a20' : '#2a1a1a',
                          color: item.is_active ? '#6fcf97' : '#e74c3c',
                          border: `1px solid ${item.is_active ? '#27ae60' : '#e74c3c'}`,
                          borderRadius: 999, padding: '3px 10px', fontSize: '0.75rem',
                          fontWeight: 600, cursor: 'pointer',
                        }}>
                        {item.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
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
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 300, padding: 24,
        }} onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 28, width: '100%', maxWidth: 560,
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h2 style={{ marginBottom: 24, fontSize: '1.1rem' }}>
              {editItem ? `Edit: ${editItem.name}` : 'Add New Item'}
            </h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Item Name *</label>
                  <input className="input" required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Description</label>
                  <input className="input" value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Category *</label>
                  <select className="select" required value={form.category_id}
                    onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">Select...</option>
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
                  <input className="input" required placeholder="e.g. sqft, hr, ea, lf"
                    value={form.unit}
                    onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Sort Order</label>
                  <input className="input" type="number"
                    value={form.sort_order}
                    onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
                  <input type="checkbox" id="is_active" checked={form.is_active}
                    onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                    style={{ width: 16, height: 16, accentColor: 'var(--rust)' }} />
                  <label htmlFor="is_active" style={{ fontSize: '0.88rem', cursor: 'pointer' }}>Active (visible on site)</label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
