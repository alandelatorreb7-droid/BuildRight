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
      background: 'var(--blue-dark)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏗️</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Build<span style={{ color: 'var(--rust)' }}>Right</span> Admin
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
          Price management panel
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 36, width: '100%', maxWidth: 380,
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
            background: '#3a1010', border: '1px solid #e74c3c',
            borderRadius: 'var(--radius)', padding: '10px 14px',
            color: '#e74c3c', fontSize: '0.85rem', marginBottom: 16,
          }}>{error}</div>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '12px' }}>
          {loading ? 'Checking...' : 'Sign In'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>← Back to estimator</a>
        </div>
      </form>
    </div>
  );
}
