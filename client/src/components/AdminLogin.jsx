import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem('adminPass', password);
        navigate('/admin/panel');
      } else {
        setError('Incorrect password. Try again.');
      }
    } catch {
      setError('Server unreachable. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'var(--rust)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em',
          margin: '0 auto 16px',
        }}>BR</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
          BuildRight Admin
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>
          Price management panel
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 32,
        width: '100%', maxWidth: 380,
        boxShadow: 'var(--shadow-md)',
      }}>
        <div className="form-group">
          <label className="label">Admin Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            required
          />
        </div>
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 'var(--radius)', padding: '10px 14px',
            color: '#991B1B', fontSize: '0.84rem', marginBottom: 16,
          }}>{error}</div>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}
          style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.9rem' }}>
          {loading ? 'Checking…' : 'Sign In'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>← Back to estimator</a>
        </div>
      </form>
    </div>
  );
}
