import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../analytics';

const benefits = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="18" height="16" rx="2"/>
        <path d="M7 8h8M7 12h5"/>
        <path d="M15 15l2 2 3-3" strokeWidth="1.8"/>
      </svg>
    ),
    title: 'Build quotes in minutes',
    desc: 'Click to add items, adjust quantities, and generate a professional estimate fast.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 19L11 3l8 16H3z"/>
        <path d="M7 13h8"/>
        <circle cx="11" cy="10" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
    title: '200+ El Paso prices built in',
    desc: 'Current local market rates for materials, labor, concrete, HVAC, and more.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="1" width="14" height="20" rx="2"/>
        <path d="M8 7h6M8 11h6M8 15h3"/>
        <path d="M14 17l2 2 3-3" strokeWidth="1.8"/>
      </svg>
    ),
    title: 'Professional PDF output',
    desc: 'Send clients a branded estimate with your company info, line items, and valid-until date.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      fontFamily: 'var(--font)',
    }}>

      {/* ── Top bar ── */}
      <header style={{
        background: 'var(--charcoal)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        height: 58, display: 'flex', alignItems: 'center',
        padding: '0 28px', flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'var(--rust)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.78rem', color: '#fff', letterSpacing: '-0.02em',
          }}>BR</div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em' }}>BuildRight</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginTop: -2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Construction Estimator
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 20px',
        textAlign: 'center',
      }}>

        {/* Hero logo */}
        <div style={{
          width: 82, height: 82, borderRadius: 20,
          background: 'var(--rust)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: '1.7rem', color: '#fff', letterSpacing: '-0.04em',
          marginBottom: 22, boxShadow: '0 6px 24px rgba(192,57,43,0.35)',
          fontFamily: 'var(--font)',
        }}>BR</div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 800,
          color: 'var(--charcoal)',
          letterSpacing: '-0.035em',
          lineHeight: 1.15,
          maxWidth: 560,
          marginBottom: 14,
        }}>
          Professional Construction Estimates<br/>
          <span style={{ color: 'var(--rust)' }}>for El Paso Contractors</span>
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '0.97rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          maxWidth: 480,
          marginBottom: 36,
        }}>
          BuildRight lets you build accurate job estimates in minutes using current El Paso market prices.
          Add line items from a 200+ item catalog, customize quantities and margins, and download
          a professional PDF ready to hand to your client — no spreadsheets, no guesswork.
        </p>

        {/* Benefits */}
        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: 36,
          maxWidth: 700,
        }}>
          {benefits.map((b, i) => (
            <div key={i} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              width: 190,
              textAlign: 'left',
              boxShadow: 'var(--shadow)',
            }}>
              <div style={{ color: 'var(--rust)', marginBottom: 10 }}>{b.icon}</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 5, letterSpacing: '-0.01em' }}>
                {b.title}
              </div>
              <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => { trackEvent('start_estimating'); navigate('/estimator'); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px',
            background: 'var(--rust)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius)',
            fontSize: '0.97rem', fontWeight: 700,
            cursor: 'pointer', letterSpacing: '-0.01em',
            boxShadow: '0 4px 14px rgba(192,57,43,0.35)',
            transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--rust-hover)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(192,57,43,0.45)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--rust)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(192,57,43,0.35)';
          }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Start Estimating — It's Free
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7h10M8 3l4 4-4 4"/>
          </svg>
        </button>

      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '14px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Questions?{' '}
          <a href="mailto:alan.delatorreb7@gmail.com" style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
            alan.delatorreb7@gmail.com
          </a>
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          BuildRight · El Paso, TX
        </span>
      </footer>

    </div>
  );
}
