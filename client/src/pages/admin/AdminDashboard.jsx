import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, FolderOpen, BarChart2, Award, PlusSquare, ChevronRight } from 'lucide-react';
import axios from '../../api/axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [counts, setCounts] = useState({ total: 0, active: 0, bids: 0, awarded: 0 });

useEffect(() => {
  const fetchCounts = async () => {
    try {
      const [tendersRes, bidsRes] = await Promise.all([
        axios.get('/tenders'),
        axios.get('/bids/all')
      ]);
      setCounts({
        total: tendersRes.data.length,
        active: tendersRes.data.filter(t => t.status === 'Open').length,
        awarded: tendersRes.data.filter(t => t.status === 'Awarded').length,
        bids: bidsRes.data.length,
      });
    } catch {
      console.error('Failed to fetch counts');
    }
  };
  fetchCounts();
}, []);

  const statCards = [
    { label: 'Total Tenders', value: counts.total, icon: FileText, borderColor: '#1a1a2e' },
    { label: 'Active Tenders', value: counts.active, icon: FolderOpen, borderColor: '#0a7c59' },
    { label: 'Total Bids', value: counts.bids, icon: BarChart2, borderColor: '#b45309' },
    { label: 'Awarded', value: counts.awarded, icon: Award, borderColor: '#6d28d9' },
  ];

  const actions = [
    { label: 'Post New Tender', desc: 'Create and publish a new tender', icon: PlusSquare, bg: '#1a1a2e', path: '/admin/post-tender' },
    { label: 'Manage Tenders', desc: 'View, edit and close tenders', icon: FolderOpen, bg: '#0a7c59', path: '/admin/tenders' },
    { label: 'View All Bids', desc: 'Review and compare submitted bids', icon: BarChart2, bg: '#b45309', path: '/admin/bids' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7', fontFamily: 'DM Sans, sans-serif' }}>
      <nav style={{
        background: '#1a1a2e', padding: '0 40px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={18} color="#e2b96f" />
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 600, color: 'white', letterSpacing: '0.3px' }}>
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

      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 40px' }}>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Dashboard / Overview</p>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#1a1a2e', margin: '0 0 4px' }}>
            Dashboard Overview
          </h2>
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Manage tenders, review bids and award contracts</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 36 }}>
          {statCards.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} style={{
                background: 'white', borderRadius: 8, padding: '20px 24px',
                border: '1px solid #e5e7eb', borderLeft: `4px solid ${card.borderColor}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>{card.label}</p>
                    <p style={{ fontSize: 30, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{card.value}</p>
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: '#f4f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={card.borderColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Actions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {actions.map((action, i) => {
              const Icon = action.icon;
              return (
                <div key={action.label}
                  onClick={() => navigate(action.path)}
                  style={{
                    padding: '22px 24px',
                    borderRight: i < actions.length - 1 ? '1px solid #e5e7eb' : 'none',
                    cursor: 'pointer', transition: 'background 0.15s',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 8, background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', margin: '0 0 2px' }}>{action.label}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{action.desc}</p>
                  </div>
                  <ChevronRight size={16} color="#d1d5db" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}