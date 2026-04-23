import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FileText, LogOut, ChevronLeft, IndianRupee, Calendar } from 'lucide-react';

const statusColors = {
  Submitted: { bg: '#dbeafe', color: '#1d4ed8' },
  'Under Review': { bg: '#fef3c7', color: '#b45309' },
  Accepted: { bg: '#dcfce7', color: '#16a34a' },
  Rejected: { bg: '#fee2e2', color: '#dc2626' },
};

export default function MyBids() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/bids/my/bids');
        setBids(res.data);
      } catch {
        toast.error('Failed to fetch bids');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
        <button onClick={() => navigate('/vendor/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 13 }}>
          <ChevronLeft size={14} /> Dashboard
        </button>
        <span style={{ color: '#d1d5db', fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>My Bids</span>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#1a1a2e', margin: '0 0 4px' }}>
            My Bids
          </h2>
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Track the status of your submitted bids</p>
        </div>

        <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              All Submitted Bids ({bids.length})
            </h3>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading bids...</div>
          ) : bids.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>You have not submitted any bids yet</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Tender', 'Category', 'Bid Amount', 'Deadline', 'Submitted On', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, i) => (
                  <tr key={bid._id} style={{ borderBottom: i < bids.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{bid.tender?.title}</p>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{bid.tender?.category}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <IndianRupee size={13} color="#374151" />
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{Number(bid.amount).toLocaleString()}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} color="#6b7280" />
                        <span style={{ fontSize: 13, color: '#374151' }}>{new Date(bid.tender?.deadline).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{new Date(bid.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                        background: statusColors[bid.status]?.bg,
                        color: statusColors[bid.status]?.color
                      }}>{bid.status}</span>
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