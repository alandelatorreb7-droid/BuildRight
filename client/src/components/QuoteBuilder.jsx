import { useState, useRef } from 'react';

const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function QuoteBuilder({ quoteItems, onRemove, onQtyChange }) {
  const [margin, setMargin] = useState(15);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const printRef = useRef();

  const materials = quoteItems.filter(i => i.item_type === 'materials');
  const labor     = quoteItems.filter(i => i.item_type === 'labor');
  const other     = quoteItems.filter(i => i.item_type === 'other');

  const subtotal = (items) => items.reduce((s, i) => s + i.unit_price * i.qty, 0);
  const matSub   = subtotal(materials);
  const labSub   = subtotal(labor);
  const othSub   = subtotal(other);
  const base     = matSub + labSub + othSub;
  const profit   = base * (margin / 100);
  const total    = base + profit;

  const handlePrint = () => window.print();

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
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    alert('Quote copied to clipboard!');
  };

  if (quoteItems.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: 48, color: 'var(--text-muted)',
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</div>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>No items yet</div>
        <div style={{ fontSize: '0.85rem' }}>Browse categories on the left and click "Add" to build your estimate.</div>
      </div>
    );
  }

  const Section = ({ title, badge, items, subtotal }) => (
    items.length > 0 && (
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span className={`badge badge-${badge}`}>{title}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px',
              background: 'var(--blue-dark)', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {fmt(item.unit_price)} / {item.unit}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button className="btn btn-ghost btn-sm"
                  onClick={() => onQtyChange(item.id, Math.max(0.1, +(item.qty - 1).toFixed(2)))}
                  style={{ padding: '4px 8px', minWidth: 28 }}>−</button>
                <input
                  type="number" min="0.01" step="0.01"
                  value={item.qty}
                  onChange={e => onQtyChange(item.id, Math.max(0.01, parseFloat(e.target.value) || 0))}
                  style={{
                    width: 64, textAlign: 'center', padding: '4px 6px',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                  }} />
                <button className="btn btn-ghost btn-sm"
                  onClick={() => onQtyChange(item.id, +(item.qty + 1).toFixed(2))}
                  style={{ padding: '4px 8px', minWidth: 28 }}>+</button>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', minWidth: 80, textAlign: 'right', color: '#fff' }}>
                {fmt(item.unit_price * item.qty)}
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => onRemove(item.id)}
                title="Remove item" style={{ padding: '4px 8px' }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'right', marginTop: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Subtotal: <strong style={{ color: 'var(--text-primary)' }}>{fmt(subtotal)}</strong>
        </div>
      </div>
    )
  );

  return (
    <div>
      {/* Project Info */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }} className="no-print">
        <div style={{ flex: 1, minWidth: 180 }}>
          <label className="label">Project Name</label>
          <input className="input" placeholder="e.g. Smith Residence Addition"
            value={projectName} onChange={e => setProjectName(e.target.value)} />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label className="label">Client / Contact</label>
          <input className="input" placeholder="e.g. John Smith"
            value={clientName} onChange={e => setClientName(e.target.value)} />
        </div>
      </div>

      {/* Print header */}
      <div style={{ display: 'none' }} className="print-only">
        <h2>BuildRight — Construction Estimate</h2>
        <p>Project: {projectName || '—'} | Client: {clientName || '—'} | Date: {new Date().toLocaleDateString()}</p>
        <hr />
      </div>

      <Section title="Materials" badge="materials" items={materials} subtotal={matSub} />
      <Section title="Labor"     badge="labor"     items={labor}     subtotal={labSub} />
      <Section title="Other"     badge="other"     items={other}     subtotal={othSub} />

      {/* Margin slider */}
      <div style={{
        background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)',
        padding: 20, marginBottom: 20, border: '1px solid var(--border)',
      }} className="no-print">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Profit / Overhead Margin</label>
          <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>{margin}%</span>
        </div>
        <input type="range" min="0" max="50" step="1" value={margin}
          onChange={e => setMargin(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--rust)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
          <span>0%</span><span>25%</span><span>50%</span>
        </div>
      </div>

      {/* Totals */}
      <div style={{
        background: 'linear-gradient(135deg, var(--blue-mid), var(--surface-3))',
        borderRadius: 'var(--radius-lg)', padding: 20,
        border: '1px solid var(--border-light)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Materials</span>
            <span>{fmt(matSub)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Labor</span>
            <span>{fmt(labSub)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Other</span>
            <span>{fmt(othSub)}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Base Cost</span>
            <span>{fmt(base)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--gold)' }}>Margin ({margin}%)</span>
            <span style={{ color: 'var(--gold)' }}>{fmt(profit)}</span>
          </div>
          <div style={{
            borderTop: '2px solid var(--rust)', paddingTop: 12, marginTop: 4,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>TOTAL ESTIMATE</span>
            <span style={{ fontWeight: 700, fontSize: '1.4rem', color: 'var(--rust-light)' }}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }} className="no-print">
        <button className="btn btn-primary btn-lg" onClick={handlePrint}>
          🖨️ Print Quote
        </button>
        <button className="btn btn-secondary btn-lg" onClick={handleCopy}>
          📋 Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
