// client/src/components/Dashboard/Dashboard.jsx

import { useEffect, useState } from 'react';
import { fetchStats } from '../../services/api.js';
import { formatSize } from '../../utils/formatSize.js';

const Dashboard = ({ onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading analytics...
          </div>
        </div>
      </div>
    );
  }

  const categories = Object.entries(stats.categoryStats);
  const maxCatSize = Math.max(...categories.map(([, v]) => v.size));

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '24px',
        }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>
              📊 Storage Analytics
            </h2>
            <p style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>
              {stats.totalNodes.toLocaleString()} total items analyzed
            </p>
          </div>
          <button onClick={onClose} style={{
            background: '#2a2a2a', border: 'none', color: '#888',
            width: '32px', height: '32px', borderRadius: '6px',
            cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>

        {/* Storage Bar */}
        <div style={{
          background: '#1a1a1a', borderRadius: '10px',
          padding: '16px', marginBottom: '20px',
          border: '1px solid #2a2a2a',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#aaa', fontSize: '13px' }}>Storage Used</span>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>
              {formatSize(stats.totalSize)} / {formatSize(stats.totalStorage)}
            </span>
          </div>
          <div style={{
            height: '8px', background: '#2a2a2a',
            borderRadius: '4px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${stats.usedPercent}%`,
              background: 'linear-gradient(90deg, #61dafb, #4CAF50)',
              borderRadius: '4px', transition: 'width 1s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ color: '#61dafb', fontSize: '12px' }}>
              {stats.usedPercent}% used
            </span>
            <span style={{ color: '#555', fontSize: '12px' }}>
              {formatSize(stats.totalStorage - stats.totalSize)} free
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px', marginBottom: '20px',
        }}>
          {[
            { label: 'Total Files', value: stats.totalFiles.toLocaleString(), icon: '📄', color: '#61dafb' },
            { label: 'Total Folders', value: stats.totalFolders.toLocaleString(), icon: '📁', color: '#FF9800' },
            { label: 'Storage Used', value: formatSize(stats.totalSize), icon: '💾', color: '#4CAF50' },
          ].map((card, i) => (
            <div key={i} style={{
              background: '#1a1a1a', borderRadius: '8px',
              padding: '14px', border: '1px solid #2a2a2a',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{card.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: card.color }}>
                {card.value}
              </div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Category Breakdown */}
          <div>
            <h3 style={{ color: '#888', fontSize: '12px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              By Category
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(([name, data]) => (
                <div key={name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    marginBottom: '3px' }}>
                    <span style={{ fontSize: '12px', color: '#aaa' }}>{name}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {data.count.toLocaleString()} · {formatSize(data.size)}
                    </span>
                  </div>
                  <div style={{ height: '5px', background: '#2a2a2a', borderRadius: '3px' }}>
                    <div style={{
                      height: '100%',
                      width: `${maxCatSize > 0 ? (data.size / maxCatSize) * 100 : 0}%`,
                      background: data.color,
                      borderRadius: '3px',
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Largest Files + Folders */}
          <div>
            <h3 style={{ color: '#888', fontSize: '12px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Largest Files
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.largestFiles.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#1a1a1a', padding: '8px 10px',
                  borderRadius: '6px', border: '1px solid #2a2a2a',
                }}>
                  <span style={{ fontSize: '16px' }}>
                    {['mp4','mkv'].includes(f.extension) ? '🎬' :
                     f.extension === 'obb' ? '📦' : '📄'}
                  </span>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '12px', color: '#ccc',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#555' }}>
                      {formatSize(f.size)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ color: '#888', fontSize: '12px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '1px',
              marginBottom: '12px', marginTop: '16px' }}>
              Largest Folders
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {stats.largestFolders.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '6px 10px',
                  background: '#1a1a1a', borderRadius: '6px',
                  border: '1px solid #2a2a2a',
                }}>
                  <span style={{ fontSize: '12px', color: '#61dafb' }}>📁 {f.name}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>{formatSize(f.size)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.7)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
};

const modalStyle = {
  background: '#141414',
  border: '1px solid #2a2a2a',
  borderRadius: '16px',
  padding: '24px',
  width: '780px',
  maxWidth: '95vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
};

export default Dashboard;