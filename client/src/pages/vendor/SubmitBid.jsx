import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FileText, LogOut, ChevronLeft, Upload, X } from 'lucide-react';

export default function SubmitBid() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ amount: '', proposal: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/tenders/${tenderId}`);
        setTender(res.data);
      } catch {
        toast.error('Failed to load tender');
      }
    };
    fetch();
  }, [tenderId]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 5) {
      toast.error('Maximum 5 documents allowed');
      return;
    }
    setFiles(prev => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('amount', form.amount);
      formData.append('proposal', form.proposal);
      files.forEach(f => formData.append('documents', f));

      await axios.post(`/bids/${tenderId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Bid submitted successfully!');
      navigate('/vendor/my-bids');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit bid');
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
            marginLeft: 12, fontSize: 11, background: 'rgba(10,124,89,0.25)',
            color: '#4ade80', padding: '2px 10px', borderRadius: 20,
            fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase'
          }}>Vendor</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'white', margin: 0 }}>{name}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Vendor Account</p>
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
        <button onClick={() => navigate('/vendor/tenders')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 13 }}>
          <ChevronLeft size={14} /> Browse Tenders
        </button>
        <span style={{ color: '#d1d5db', fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>Submit Bid</span>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#1a1a2e', margin: '0 0 4px' }}>
            Submit Bid
          </h2>
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Fill in your bid details and upload supporting documents</p>
        </div>

        {/* Tender Info Card */}
        {tender && (
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e5e7eb', padding: '18px 24px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tender</p>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>{tender.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{tender.category} · Budget: ₹{Number(tender.budget).toLocaleString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deadline</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{new Date(tender.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bid Form */}
        <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Bid Details
            </h3>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Bid Amount (₹)</label>
              <input type="number" placeholder="Enter your bid amount"
                style={inputStyle}
                onChange={e => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>Proposal / Cover Letter</label>
              <textarea placeholder="Describe your approach, experience, and why you should be selected..."
                rows={5} style={{ ...inputStyle, resize: 'vertical' }}
                onChange={e => setForm({ ...form, proposal: e.target.value })} required />
            </div>

            {/* File Upload */}
            <div>
              <label style={labelStyle}>Supporting Documents (Max 5 files — PDF, DOC, JPG, PNG)</label>
              <div style={{
                border: '2px dashed #e5e7eb', borderRadius: 8, padding: '24px',
                textAlign: 'center', cursor: 'pointer', position: 'relative',
                transition: 'border-color 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#1a1a2e'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                <Upload size={24} color="#9ca3af" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Click to upload or drag and drop</p>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>PDF, DOC, JPG, PNG up to 5 files</p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {files.map((file, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', background: '#f9fafb', borderRadius: 6,
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText size={14} color="#6b7280" />
                        <span style={{ fontSize: 13, color: '#374151' }}>{file.name}</span>
                      </div>
                      <button type="button" onClick={() => removeFile(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
              <button type="button" onClick={() => navigate('/vendor/tenders')}
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
                {loading ? 'Submitting...' : 'Submit Bid'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}