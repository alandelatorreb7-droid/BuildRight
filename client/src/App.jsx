import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import QuotePage from './components/QuotePage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { initAnalytics, trackPageView } from './analytics';

initAnalytics();

const FEEDBACK_EMAIL =
  'mailto:alan.delatorreb7@gmail.com' +
  '?subject=BuildRight%20Feedback' +
  '&body=Hi%2C%20I%20have%20some%20feedback%20about%20BuildRight%3A%20';

const FEEDBACK_WA =
  'https://wa.me/19152234822?text=Hi%2C%20I%20have%20feedback%20about%20BuildRight%3A%20';

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '5px 10px',
  background: 'transparent',
  borderRadius: 999,
  fontSize: '0.72rem', fontWeight: 500,
  transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  fontFamily: 'var(--font)',
};

function FeedbackButton({ isLanding }) {
  const cls = isLanding ? 'no-print feedback-btns-top' : 'no-print feedback-btns';
  return (
    <div className={cls}>
      {/* WhatsApp */}
      <button
        onClick={() => window.open(FEEDBACK_WA, '_blank')}
        style={{
          ...btnBase,
          border: '1px solid rgba(37,211,102,0.45)',
          color: 'rgba(22,163,74,0.8)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(37,211,102,0.08)';
          e.currentTarget.style.color = '#16a34a';
          e.currentTarget.style.borderColor = 'rgba(37,211,102,0.7)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'rgba(22,163,74,0.8)';
          e.currentTarget.style.borderColor = 'rgba(37,211,102,0.45)';
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="btn-label">WhatsApp</span>
      </button>

      {/* Email */}
      <button
        onClick={() => { window.location.href = FEEDBACK_EMAIL; }}
        style={{
          ...btnBase,
          border: '1px solid rgba(192,57,43,0.35)',
          color: 'rgba(192,57,43,0.7)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(192,57,43,0.07)';
          e.currentTarget.style.color = 'var(--rust)';
          e.currentTarget.style.borderColor = 'rgba(192,57,43,0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'rgba(192,57,43,0.7)';
          e.currentTarget.style.borderColor = 'rgba(192,57,43,0.35)';
        }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11.5 8.5a1 1 0 0 1-1 1h-7l-2 2V2.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6z"/>
        </svg>
        <span className="btn-label">Feedback</span>
      </button>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin   = pathname.startsWith('/admin');
  const isLanding = pathname === '/';

  useEffect(() => { trackPageView(pathname); }, [pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/estimator" element={<QuotePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
      </Routes>
      {!isAdmin && <FeedbackButton isLanding={isLanding} />}
    </>
  );
}
