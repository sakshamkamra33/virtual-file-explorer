// client/src/components/Dashboard/StorageCleaner.jsx

import { useState, useEffect } from 'react';
import useFileTreeStore from '../../store/fileTreeStore.js';
import { formatSize } from '../../utils/formatSize.js';

const CLEANER_RULES = [
  {
    id: 'tmp_files',
    title: 'Temporary Files',
    icon: '🗑️',
    color: '#F44336',
    exts: ['tmp'],
    description: 'Leftover temp files that are safe to delete',
  },
  {
    id: 'cache_files',
    title: 'Cache Files',
    icon: '⚡',
    color: '#FF9800',
    exts: ['cache', 'exo'],
    description: 'App cache files, will be recreated automatically',
  },
  {
    id: 'log_files',
    title: 'Log Files',
    icon: '📋',
    color: '#9C27B0',
    exts: ['log'],
    description: 'App log files no longer needed',
  },
  {
    id: 'torrent_files',
    title: 'Torrent Files',
    icon: '🌐',
    color: '#2196F3',
    exts: ['torrent'],
    description: 'Torrent files after download is complete',
  },
  {
    id: 'large_videos',
    title: 'Large Videos (>50MB)',
    icon: '🎬',
    color: '#4CAF50',
    exts: ['mp4', 'mkv'],
    minSize: 50_000_000,
    description: 'Large video files taking up significant space',
  },
  {
    id: 'apk_files',
    title: 'APK Installers',
    icon: '📦',
    color: '#795548',
    exts: ['apk'],
    description: 'App installer files after apps are installed',
  },
];

const StorageCleaner = ({ onClose }) => {
  const { nodes } = useFileTreeStore();
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allFiles = Object.values(nodes).filter(n => n.type === 'file');

    const results = CLEANER_RULES.map(rule => {
      const matches = allFiles.filter(f => {
        const extMatch = rule.exts.includes(f.extension || '');
        const sizeMatch = rule.minSize ? (f.size || 0) >= rule.minSize : true;
        return extMatch && sizeMatch;
      });

      const totalSize = matches.reduce((s, f) => s + (f.size || 0), 0);

      return {
        ...rule,
        files: matches,
        count: matches.length,
        totalSize,
      };
    }).filter(r => r.count > 0);

    setSuggestions(results);
    // Select all by default
    setSelected(new Set(results.map(r => r.id)));
    setLoading(false);
  }, [nodes]);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedSuggestions = suggestions.filter(s => selected.has(s.id));
  const totalFreeable = selectedSuggestions.reduce((s, r) => s + r.totalSize, 0);
  const totalFiles = selectedSuggestions.reduce((s, r) => s + r.count, 0);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '20px',
        }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>
              🧹 Storage Cleaner
            </h2>
            <p style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>
              Smart suggestions to free up space
            </p>
          </div>
          <button onClick={onClose} style={{
            background: '#2a2a2a', border: 'none', color: '#888',
            width: '32px', height: '32px', borderRadius: '6px',
            cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Analyzing storage...
          </div>
        ) : (
          <>
            {/* Freeable Space Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #1a2a1a, #1a1a2a)',
              border: '1px solid #2a3a2a',
              borderRadius: '12px', padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#4CAF50' }}>
                  {formatSize(totalFreeable)}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  can be freed from {totalFiles.toLocaleString()} files
                </div>
              </div>
              <button style={{
                background: '#4CAF50', border: 'none', color: '#fff',
                padding: '10px 20px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              }}
                onClick={() => alert(`✅ Demo: Would delete ${totalFiles} files and free ${formatSize(totalFreeable)}`)}>
                🧹 Clean Now
              </button>
            </div>

            {/* Suggestions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {suggestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
                  ✅ Storage looks clean! Expand more folders to scan.
                </div>
              ) : (
                suggestions.map(rule => (
                  <div
                    key={rule.id}
                    onClick={() => toggleSelect(rule.id)}
                    style={{
                      background: selected.has(rule.id) ? '#1a1a2a' : '#1a1a1a',
                      border: `1px solid ${selected.has(rule.id) ? '#333a55' : '#2a2a2a'}`,
                      borderRadius: '10px', padding: '14px 16px',
                      cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: '14px',
                    }}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '5px',
                      border: `2px solid ${selected.has(rule.id) ? rule.color : '#444'}`,
                      background: selected.has(rule.id) ? rule.color + '33' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {selected.has(rule.id) && (
                        <span style={{ color: rule.color, fontSize: '12px' }}>✓</span>
                      )}
                    </div>

                    {/* Icon */}
                    <span style={{ fontSize: '24px' }}>{rule.icon}</span>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '13px', fontWeight: 600,
                        color: '#ccc', marginBottom: '2px',
                      }}>
                        {rule.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#555' }}>
                        {rule.description}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '14px', fontWeight: 700,
                        color: rule.color,
                      }}>
                        {formatSize(rule.totalSize)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#555' }}>
                        {rule.count.toLocaleString()} files
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom note */}
            <div style={{
              marginTop: '16px', padding: '10px 14px',
              background: '#1a1a1a', borderRadius: '8px',
              fontSize: '11px', color: '#555',
              border: '1px solid #2a2a2a',
            }}>
              💡 This is a demo — no files are actually deleted.
              Expand more folders in the tree to find more suggestions.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.7)',
  zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(4px)',
};

const modalStyle = {
  background: '#141414',
  border: '1px solid #2a2a2a',
  borderRadius: '16px',
  padding: '24px',
  width: '620px',
  maxWidth: '95vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
};

export default StorageCleaner;