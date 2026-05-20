import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{
      background: 'var(--charcoal)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 7,
            background: 'var(--rust)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.8rem', color: '#fff', letterSpacing: '-0.02em',
            flexShrink: 0,
          }}>BR</div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em' }}>
              BuildRight
            </div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginTop: -2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Construction Estimator
            </div>
          </div>
        </Link>

      </div>
    </header>
  );
}
