import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{
      background: 'var(--blue-mid)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.6rem' }}>🏗️</span>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              Build<span style={{ color: 'var(--rust)' }}>Right</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: -2 }}>
              El Paso Construction Estimator
            </div>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href="/admin"
            style={{
              fontSize: '0.82rem', color: 'var(--text-muted)',
              padding: '6px 12px', borderRadius: 'var(--radius)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            Admin
          </a>
        </nav>
      </div>
    </header>
  );
}
