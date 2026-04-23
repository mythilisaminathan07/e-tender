import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FileText, LogOut, Plus, Trash2, ChevronLeft, RefreshCw } from 'lucide-react';

const statusColors = {
  Open: { bg: '#dcfce7', color: '#16a34a' },
  Closed: { bg: '#fee2e2', color: '#dc2626' },
  Awarded: { bg: '#ede9fe', color: '#7c3aed' },
};

export default function ManageTenders() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTenders = async () => {
    try {
      const res = await axios.get('/tenders');
      setTenders(res.data);
    } catch {
      toast.error('Failed to fetch tenders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTenders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/tenders/${id}/status`, { status });
      toast.success(`Tender marked as ${status}`);
      fetchTenders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tender?')) return;
    try {
      await axios.delete(`/tenders/${id}`);
      toast.success('Tender deleted');
      fetchTenders();
    } catch {
      toast.error('Failed to delete tender');
    }
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
        <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>Manage Tenders</span>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#1a1a2e', margin: '0 0 4px' }}>
              Manage Tenders
            </h2>
            <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>View, update status and delete tenders</p>
          </div>
          <button onClick={() => navigate('/admin/post-tender')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 6, border: 'none',
              background: '#1a1a2e', color: 'white', fontSize: 13,
              fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
            }}>
            <Plus size={15} /> Post New Tender
          </button>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              All Tenders ({tenders.length})
            </h3>
            <button onClick={fetchTenders}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 13 }}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading tenders...</div>
          ) : tenders.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No tenders posted yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Title', 'Category', 'Budget', 'Deadline', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tenders.map((tender, i) => (
                  <tr key={tender._id} style={{ borderBottom: i < tenders.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{tender.title}</p>
                      <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
                        {tender.description.substring(0, 50)}...
                      </p>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{tender.category}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>₹{Number(tender.budget).toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{new Date(tender.deadline).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                        background: statusColors[tender.status]?.bg,
                        color: statusColors[tender.status]?.color
                      }}>{tender.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {tender.status === 'Open' && (
                          <button onClick={() => handleStatusChange(tender._id, 'Closed')}
                            style={{
                              padding: '5px 10px', borderRadius: 5, border: '1px solid #e5e7eb',
                              background: 'white', fontSize: 12, color: '#374151', cursor: 'pointer',
                              fontFamily: 'DM Sans, sans-serif'
                            }}>Close</button>
                        )}
                        <button onClick={() => handleDelete(tender._id)}
                          style={{
                            padding: '5px 8px', borderRadius: 5, border: '1px solid #fee2e2',
                            background: 'white', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center'
                          }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}