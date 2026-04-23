import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/register', form);
      toast.success('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    border: '1.5px solid #e8e8e8', background: 'white',
    fontSize: 14, color: '#1a1a2e', boxSizing: 'border-box',
    transition: 'all 0.2s'
  };

  const labelStyle = {
    fontSize: 13, fontWeight: 500, color: '#444',
    display: 'block', marginBottom: 6
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
          Join as a<br />Verified<br />Vendor
        </h1>
        <p style={{ opacity: 0.6, fontSize: 15, lineHeight: 1.7, maxWidth: 300 }}>
          Register your company and start submitting competitive bids on published tenders.
        </p>
        <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Company profile setup', 'Bid on active tenders', 'Track your submissions'].map(item => (
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
        justifyContent: 'center', padding: '40px 20px', overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1a1a2e', marginBottom: 8 }}>
              Create account
            </h2>
            <p style={{ color: '#888', fontSize: 14 }}>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input placeholder="John Smith" style={inputStyle} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>Company Name</label>
              <input placeholder="Your Company Ltd." style={inputStyle} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input placeholder="+91 98765 43210" style={inputStyle} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="you@company.com" style={inputStyle} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" placeholder="••••••••" style={inputStyle} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 10,
                background: loading ? '#888' : '#1a1a2e',
                color: 'white', fontWeight: 500, fontSize: 15,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', marginTop: 4
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#888' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1a1a2e', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #1a1a2e' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}