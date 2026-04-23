import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import {
  FileText, LogOut, ChevronLeft, Download,
  CheckCircle, IndianRupee, User, Building2, Phone, Mail
} from 'lucide-react';

const statusColors = {
  Submitted: { bg: '#dbeafe', color: '#1d4ed8' },
  'Under Review': { bg: '#fef3c7', color: '#b45309' },
  Accepted: { bg: '#dcfce7', color: '#16a34a' },
  Rejected: { bg: '#fee2e2', color: '#dc2626' },
};

const tenderStatusColors = {
  Open: { bg: '#dcfce7', color: '#16a34a' },
  Closed: { bg: '#fee2e2', color: '#dc2626' },
  Awarded: { bg: '#ede9fe', color: '#7c3aed' },
};

export default function ViewBids() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [tenders, setTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [loadingTenders, setLoadingTenders] = useState(true);
  const [loadingBids, setLoadingBids] = useState(false);
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await axios.get('/tenders');
        setTenders(res.data);
      } catch {
        toast.error('Failed to fetch tenders');
      } finally {
        setLoadingTenders(false);
      }
    };
    fetchTenders();
  }, []);

  const fetchBids = async (tender) => {
    setSelectedTender(tender);
    setLoadingBids(true);
    try {
      const res = await axios.get(`/bids/${tender._id}`);
      setBids(res.data);
    } catch {
      toast.error('Failed to fetch bids');
    } finally {
      setLoadingBids(false);
    }
  };

  const handleAccept = async (bidId) => {
    if (!window.confirm('Accept this bid and award the tender?')) return;
    setAccepting(bidId);
    try {
      await axios.put(`/bids/${bidId}/accept`);
      toast.success('Bid accepted! Tender awarded successfully.');
      fetchBids(selectedTender);
      const res = await axios.get('/tenders');
      setTenders(res.data);
    } catch {
      toast.error('Failed to accept bid');
    } finally {
      setAccepting(null);
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
        <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>View Bids</span>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#1a1a2e', margin: '0 0 4px' }}>
            View & Award Bids
          </h2>
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
            Select a tender to view all submitted bids and award the contract
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>

          {/* Left — Tender List */}
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden', alignSelf: 'start' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                All Tenders
              </h3>
            </div>
            {loadingTenders ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Loading...</div>
            ) : tenders.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No tenders found</div>
            ) : (
              tenders.map((tender, i) => (
                <div key={tender._id}
                  onClick={() => fetchBids(tender)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: i < tenders.length - 1 ? '1px solid #f3f4f6' : 'none',
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: selectedTender?._id === tender._id ? '#f0f4ff' : 'transparent',
                    borderLeft: selectedTender?._id === tender._id ? '3px solid #1a1a2e' : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (selectedTender?._id !== tender._id) e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={e => { if (selectedTender?._id !== tender._id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px', flex: 1, paddingRight: 8 }}>{tender.title}</p>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, flexShrink: 0,
                      background: tenderStatusColors[tender.status]?.bg,
                      color: tenderStatusColors[tender.status]?.color
                    }}>{tender.status}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{tender.category}</p>
                </div>
              ))
            )}
          </div>

          {/* Right — Bids Panel */}
          <div>
            {!selectedTender ? (
              <div style={{
                background: 'white', borderRadius: 8, border: '1px solid #e5e7eb',
                padding: 60, textAlign: 'center', color: '#9ca3af'
              }}>
                <FileText size={32} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: 14, margin: 0 }}>Select a tender from the left to view its bids</p>
              </div>
            ) : (
              <div>
                {/* Tender Summary */}
                <div style={{
                  background: 'white', borderRadius: 8, border: '1px solid #e5e7eb',
                  padding: '18px 24px', marginBottom: 16
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>{selectedTender.title}</h3>
                      <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                        {selectedTender.category} · Budget: ₹{Number(selectedTender.budget).toLocaleString()} · Deadline: {new Date(selectedTender.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
                      background: tenderStatusColors[selectedTender.status]?.bg,
                      color: tenderStatusColors[selectedTender.status]?.color
                    }}>{selectedTender.status}</span>
                  </div>
                </div>

                {/* Bids */}
                <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 24px', borderBottom: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Submitted Bids ({bids.length})
                    </h3>
                  </div>

                  {loadingBids ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Loading bids...</div>
                  ) : bids.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No bids submitted for this tender yet</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {bids.map((bid, i) => (
                        <div key={bid._id} style={{
                          padding: '20px 24px',
                          borderBottom: i < bids.length - 1 ? '1px solid #f3f4f6' : 'none',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            {/* Vendor Info */}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{
                                  width: 36, height: 36, borderRadius: 8,
                                  background: '#f4f5f7', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center'
                                }}>
                                  <User size={16} color="#6b7280" />
                                </div>
                                <div>
                                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>{bid.vendor?.name}</p>
                                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{bid.vendor?.company || 'No company listed'}</p>
                                </div>
                                <span style={{
                                  marginLeft: 8, fontSize: 11, fontWeight: 600,
                                  padding: '2px 10px', borderRadius: 20,
                                  background: statusColors[bid.status]?.bg,
                                  color: statusColors[bid.status]?.color
                                }}>{bid.status}</span>
                              </div>

                              {/* Contact */}
                              <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                  <Mail size={12} color="#9ca3af" />
                                  <span style={{ fontSize: 12, color: '#6b7280' }}>{bid.vendor?.email}</span>
                                </div>
                                {bid.vendor?.phone && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <Phone size={12} color="#9ca3af" />
                                    <span style={{ fontSize: 12, color: '#6b7280' }}>{bid.vendor?.phone}</span>
                                  </div>
                                )}
                              </div>

                              {/* Bid Amount */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                <IndianRupee size={14} color="#0a7c59" />
                                <span style={{ fontSize: 18, fontWeight: 700, color: '#0a7c59' }}>
                                  {Number(bid.amount).toLocaleString()}
                                </span>
                                <span style={{ fontSize: 12, color: '#9ca3af' }}>bid amount</span>
                              </div>

                              {/* Proposal */}
                              <div style={{
                                background: '#f9fafb', borderRadius: 6,
                                padding: '10px 14px', marginBottom: 12,
                                border: '1px solid #f3f4f6'
                              }}>
                                <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px', fontWeight: 500 }}>PROPOSAL</p>
                                <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>
                                  {bid.proposal}
                                </p>
                              </div>

                              {/* Documents */}
                              {bid.documents?.length > 0 && (
                                <div>
                                  <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 8px', fontWeight: 500 }}>DOCUMENTS</p>
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {bid.documents.map((doc, j) => (
                                      <a key={j}
                                        href={`http://localhost:5000/uploads/${doc.filename}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                          display: 'flex', alignItems: 'center', gap: 6,
                                          padding: '6px 12px', borderRadius: 6,
                                          border: '1px solid #e5e7eb', background: 'white',
                                          fontSize: 12, color: '#374151', textDecoration: 'none',
                                          transition: 'all 0.15s'
                                        }}>
                                        <Download size={12} color="#6b7280" />
                                        {doc.originalname}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Accept Button */}
                            <div style={{ marginLeft: 20, flexShrink: 0 }}>
                              {bid.status === 'Accepted' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a' }}>
                                  <CheckCircle size={16} />
                                  <span style={{ fontSize: 13, fontWeight: 600 }}>Awarded</span>
                                </div>
                              ) : bid.status === 'Rejected' ? (
                                <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 500 }}>Rejected</span>
                              ) : selectedTender.status === 'Open' || selectedTender.status === 'Closed' ? (
                                <button
                                  onClick={() => handleAccept(bid._id)}
                                  disabled={accepting === bid._id}
                                  style={{
                                    padding: '8px 18px', borderRadius: 6, border: 'none',
                                    background: accepting === bid._id ? '#9ca3af' : '#0a7c59',
                                    color: 'white', fontSize: 13, fontWeight: 500,
                                    cursor: accepting === bid._id ? 'not-allowed' : 'pointer',
                                    fontFamily: 'DM Sans, sans-serif'
                                  }}>
                                  {accepting === bid._id ? 'Awarding...' : 'Award Tender'}
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}