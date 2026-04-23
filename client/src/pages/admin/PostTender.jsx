import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FileText, LogOut, ChevronLeft } from 'lucide-react';

const categories = ['Construction', 'IT Services', 'Goods & Supply', 'Consulting', 'Infrastructure', 'Healthcare', 'Education', 'Other'];

export default function PostTender() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '', budget: '', deadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/tenders', form);
      toast.success('Tender posted successfully!');
      navigate('/admin/tenders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post tender');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 6,
    border: '1px solid #e5e7eb', background: 'white',
    fontSize: 14, color: '#1a1a2e', boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif', outline: 'none'
  };

  const labelStyle = {
    fontSize: 13, fontWeight: 500, color: '#374151',
    display: 'block', marginBottom: 6
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Navbar */}
      <nav style={{
        background: '#1a1a2e', padding: '0 40px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={18} color="#e2b96f" />
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 600, color: 'white' }}>
            E-Tender Portal
          </span>
          <span style={{
            marginLeft: 12, fontSize: 11, background: 'rgba(226,185,111,0.2)',
            color: '#e2b96f', padding: '2px 10px', borderRadius: 20,
            fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase'
          }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'white', margin: 0 }}>{name}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Administrator</p>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent', color: 'rgba(255,255,255,0.75)',
              fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
            }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 40px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => navigate('/admin/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 13 }}>
          <ChevronLeft size={14} /> Dashboard
        </button>
        <span style={{ color: '#d1d5db', fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>Post New Tender</span>
      </div>

      {/* Form */}
      <div style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#1a1a2e', margin: '0 0 4px' }}>
            Post New Tender
          </h2>
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Fill in the details to publish a new tender</p>
        </div>

        <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tender Details
            </h3>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Tender Title</label>
              <input placeholder="e.g. Supply of Office Equipment" style={inputStyle}
                onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea placeholder="Describe the tender requirements in detail..."
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
                onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} onChange={e => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Budget (₹)</label>
                <input type="number" placeholder="e.g. 500000" style={inputStyle}
                  onChange={e => setForm({ ...form, budget: e.target.value })} required />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Bid Deadline</label>
              <input type="date" style={inputStyle}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, deadline: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
              <button type="button" onClick={() => navigate('/admin/tenders')}
                style={{
                  padding: '9px 20px', borderRadius: 6, border: '1px solid #e5e7eb',
                  background: 'white', fontSize: 14, color: '#374151', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif'
                }}>Cancel</button>
              <button type="submit" disabled={loading}
                style={{
                  padding: '9px 24px', borderRadius: 6, border: 'none',
                  background: loading ? '#9ca3af' : '#1a1a2e',
                  color: 'white', fontSize: 14, fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                {loading ? 'Publishing...' : 'Publish Tender'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}