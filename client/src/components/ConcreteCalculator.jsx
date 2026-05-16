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

export default function ConcreteCalculator({ onAddCuYard }) {
  const [shape, setShape] = useState('rect');
  const [dims, setDims] = useState({});
  const [wastePct, setWastePct] = useState(10);

  const cuYd = calcCuYd(shape, dims);
  const cuYdWithWaste = cuYd * (1 + wastePct / 100);

  const set = (key, val) => setDims(d => ({ ...d, [key]: val }));

  const fieldStyle = {
    display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 100,
  };
  const row = { display: 'flex', gap: 12, flexWrap: 'wrap' };

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--surface), var(--surface-2))',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: '1.4rem' }}>📐</span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Cubic Yard Calculator</h3>
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
          <label className="label">Waste / Overage: {wastePct}%</label>
          <input type="range" min="5" max="25" step="1" value={wastePct}
            onChange={e => setWastePct(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--rust)' }} />
        </div>

        {cuYd > 0 && (
          <div style={{
            marginTop: 20, padding: 16,
            background: 'var(--blue-dark)', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Net volume</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {cuYd.toFixed(2)} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>cu yd</span>
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>With {wastePct}% waste</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold)' }}>
                {cuYdWithWaste.toFixed(2)} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>cu yd</span>
              </div>
            </div>
            {onAddCuYard && (
              <button className="btn btn-primary"
                onClick={() => onAddCuYard(cuYdWithWaste)}>
                Use This Volume
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
