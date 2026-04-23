import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      toast.success(`Welcome back, ${res.data.name}!`);
      if (res.data.role === 'admin') navigate('/admin/dashboard');
      else navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex' }}>
      {/* Left Panel */}
      <div style={{
        width: '45%',
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'flex-start', padding: '60px', color: 'white'
      }} className="hidden md:flex">
        <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 40
        }}>
  <FileText size={22} color="white" />
</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 38, fontWeight: 600, lineHeight: 1.2, marginBottom: 20 }}>
          E-Tender<br />Management<br />Portal
        </h1>
        <p style={{ opacity: 0.6, fontSize: 15, lineHeight: 1.7, maxWidth: 300 }}>
          A secure and transparent platform for managing government and private tenders end-to-end.
        </p>
        <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Secure bid submissions', 'Document management', 'Real-time notifications'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.75 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e2b96f' }} />
              <span style={{ fontSize: 14 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 20px'
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1a1a2e', marginBottom: 8 }}>
              Welcome back
            </h2>
            <p style={{ color: '#888', fontSize: 14 }}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#444', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email" placeholder="you@example.com"
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  border: '1.5px solid #e8e8e8', background: 'white',
                  fontSize: 14, color: '#1a1a2e', boxSizing: 'border-box',
                  transition: 'all 0.2s'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#444', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" placeholder="••••••••"
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  border: '1.5px solid #e8e8e8', background: 'white',
                  fontSize: 14, color: '#1a1a2e', boxSizing: 'border-box',
                  transition: 'all 0.2s'
                }}
              />
            </div>
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 10,
                background: loading ? '#888' : '#1a1a2e',
                color: 'white', fontWeight: 500, fontSize: 15,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', marginTop: 4,
                letterSpacing: '0.3px'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#888' }}>
            New vendor?{' '}
            <Link to="/register" style={{ color: '#1a1a2e', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #1a1a2e' }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}