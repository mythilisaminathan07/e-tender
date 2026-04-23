import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FileText, LogOut, Search, ChevronRight, ChevronLeft, Calendar, IndianRupee } from 'lucide-react';

const statusColors = {
  Open: { bg: '#dcfce7', color: '#16a34a' },
  Closed: { bg: '#fee2e2', color: '#dc2626' },
  Awarded: { bg: '#ede9fe', color: '#7c3aed' },
};

export default function BrowseTenders() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [tenders, setTenders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/tenders');
        setTenders(res.data);
        setFiltered(res.data);
      } catch {
        toast.error('Failed to fetch tenders');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(tenders.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    ));
  }, [search, tenders]);

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
        <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>Browse Tenders</span>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#1a1a2e', margin: '0 0 4px' }}>
              Available Tenders
            </h2>
            <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Browse and submit bids on open tenders</p>
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#9ca3af" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              placeholder="Search tenders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '9px 14px 9px 34px', borderRadius: 6,
                border: '1px solid #e5e7eb', background: 'white',
                fontSize: 13, color: '#1a1a2e', width: 240,
                fontFamily: 'DM Sans, sans-serif', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Tender Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading tenders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>No tenders found</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
            {filtered.map(tender => (
              <div key={tender._id} style={{
                background: 'white', borderRadius: 8, border: '1px solid #e5e7eb',
                overflow: 'hidden', transition: 'box-shadow 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                      background: statusColors[tender.status]?.bg,
                      color: statusColors[tender.status]?.color
                    }}>{tender.status}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af', background: '#f4f5f7', padding: '3px 10px', borderRadius: 20 }}>
                      {tender.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', margin: '0 0 8px' }}>{tender.title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                    {tender.description.substring(0, 100)}...
                  </p>
                </div>
                <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <IndianRupee size={13} color="#6b7280" />
                      <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
                        {Number(tender.budget).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar size={13} color="#6b7280" />
                      <span style={{ fontSize: 13, color: '#374151' }}>
                        {new Date(tender.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {tender.status === 'Open' && (
                    <button
                      onClick={() => navigate(`/vendor/submit-bid/${tender._id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '7px 14px', borderRadius: 6, border: 'none',
                        background: '#1a1a2e', color: 'white', fontSize: 12,
                        fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                      }}>
                      Submit Bid <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}