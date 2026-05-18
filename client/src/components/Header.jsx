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

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <a
            href="/admin"
            style={{
              fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)',
              padding: '6px 12px', borderRadius: 'var(--radius)',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Admin
          </a>
        </nav>
      </div>
    </header>
  );
}
