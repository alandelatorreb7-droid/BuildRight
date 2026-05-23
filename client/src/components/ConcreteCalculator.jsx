import { useState } from 'react';

const shapes = [
  { label: 'Rectangular Slab / Footing', value: 'rect' },
  { label: 'Circular Slab', value: 'circle' },
  { label: 'Column / Cylinder', value: 'cylinder' },
  { label: 'Triangular Slab', value: 'triangle' },
];

function calcCuYd(shape, dims) {
  let cubicFt = 0;
  const { length, width, depth, diameter, base, height } = dims;
  if (shape === 'rect') {
    cubicFt = (parseFloat(length) || 0) * (parseFloat(width) || 0) * ((parseFloat(depth) || 0) / 12);
  } else if (shape === 'circle') {
    const r = (parseFloat(diameter) || 0) / 2;
    cubicFt = Math.PI * r * r * ((parseFloat(depth) || 0) / 12);
  } else if (shape === 'cylinder') {
    const r = (parseFloat(diameter) || 0) / 2;
    cubicFt = Math.PI * r * r * (parseFloat(height) || 0);
  } else if (shape === 'triangle') {
    cubicFt = 0.5 * (parseFloat(base) || 0) * (parseFloat(width) || 0) * ((parseFloat(depth) || 0) / 12);
  }
  return cubicFt / 27;
}

export default function ConcreteCalculator({ onAddCuYard, concreteItems = [] }) {
  const [shape, setShape] = useState('rect');
  const [dims, setDims] = useState({});
  const [wastePct, setWastePct] = useState(10);
  const [addError, setAddError] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const effectiveItemId = selectedItemId ?? concreteItems[0]?.id ?? null;

  const cuYd = calcCuYd(shape, dims);
  const cuYdWithWaste = cuYd * (1 + wastePct / 100);

  const set = (key, val) => setDims(d => ({ ...d, [key]: val }));

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 100 };
  const row = { display: 'flex', gap: 12, flexWrap: 'wrap' };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 20,
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 15L8 1l7 14H1z"/>
            <path d="M5 10h6"/>
          </svg>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Cubic Yard Calculator</h3>
        </div>

        <div className="form-group">
          <label className="label">Shape</label>
          <select className="select" value={shape} onChange={e => { setShape(e.target.value); setDims({}); }}>
            {shapes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div style={row}>
          {(shape === 'rect' || shape === 'triangle') && (<>
            <div style={fieldStyle}>
              <label className="label">Length (ft)</label>
              <input className="input" type="number" min="0" step="0.1" placeholder="0"
                value={dims.length || ''} onChange={e => set('length', e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label className="label">Width (ft)</label>
              <input className="input" type="number" min="0" step="0.1" placeholder="0"
                value={dims.width || ''} onChange={e => set('width', e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label className="label">Thickness (in)</label>
              <input className="input" type="number" min="0" step="0.25" placeholder="4"
                value={dims.depth || ''} onChange={e => set('depth', e.target.value)} />
            </div>
          </>)}
          {shape === 'circle' && (<>
            <div style={fieldStyle}>
              <label className="label">Diameter (ft)</label>
              <input className="input" type="number" min="0" step="0.1" placeholder="0"
                value={dims.diameter || ''} onChange={e => set('diameter', e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label className="label">Thickness (in)</label>
              <input className="input" type="number" min="0" step="0.25" placeholder="4"
                value={dims.depth || ''} onChange={e => set('depth', e.target.value)} />
            </div>
          </>)}
          {shape === 'cylinder' && (<>
            <div style={fieldStyle}>
              <label className="label">Diameter (ft)</label>
              <input className="input" type="number" min="0" step="0.1" placeholder="0"
                value={dims.diameter || ''} onChange={e => set('diameter', e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label className="label">Height (ft)</label>
              <input className="input" type="number" min="0" step="0.1" placeholder="0"
                value={dims.height || ''} onChange={e => set('height', e.target.value)} />
            </div>
          </>)}
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <label className="label" style={{ marginBottom: 0 }}>Waste / Overage</label>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--amber)' }}>{wastePct}%</span>
          </div>
          <input type="range" min="5" max="25" step="1" value={wastePct}
            onChange={e => setWastePct(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--charcoal)' }} />
        </div>

        {cuYd > 0 && (
          <div style={{
            marginTop: 18, padding: 16,
            background: 'var(--surface-2)', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 2 }}>Net volume</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {cuYd.toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>cu yd</span>
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 2 }}>With {wastePct}% waste</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--amber)', letterSpacing: '-0.02em' }}>
                {cuYdWithWaste.toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>cu yd</span>
              </div>
            </div>
            {onAddCuYard && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                {concreteItems.length > 0 && (
                  <select
                    className="select"
                    value={effectiveItemId ?? ''}
                    onChange={e => setSelectedItemId(Number(e.target.value))}
                  >
                    {concreteItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} — ${item.unit_price}/cu yd
                      </option>
                    ))}
                  </select>
                )}
                <button className="btn btn-primary"
                  onClick={() => setAddError(onAddCuYard(cuYdWithWaste, effectiveItemId) ?? null)}>
                  Use This Volume
                </button>
                {addError && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--rust)' }}>
                    {addError}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
