// client/src/components/Dashboard/DuplicateFinder.jsx

import { useState, useEffect } from 'react';
import useFileTreeStore from '../../store/fileTreeStore.js';
import { formatSize } from '../../utils/formatSize.js';
import { getFileType, getCategoryIcon } from '../../utils/fileTypeMap.js';

const DuplicateFinder = ({ onClose }) => {
  const { nodes } = useFileTreeStore();
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalWasted, setTotalWasted] = useState(0);

  useEffect(() => {
    // Find duplicates from loaded nodes
    const nameMap = {};

    Object.values(nodes).forEach(node => {
      if (node.type !== 'file') return;
      const key = node.name.toLowerCase();
      if (!nameMap[key]) nameMap[key] = [];
      nameMap[key].push(node);
    });

    // Keep only names with 2+ files
    const dupes = Object.entries(nameMap)
      .filter(([, files]) => files.length >= 2)
      .map(([name, files]) => ({ name, files, count: files.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // top 20 duplicate groups

    // Calculate wasted space
    const wasted = dupes.reduce((sum, group) => {
      const sizes = group.files.map(f => f.size || 0);
      const minSize = Math.min(...sizes);
      return sum + sizes.reduce((s, size) => s + size - minSize, 0);
    }, 0);

    setDuplicates(dupes);
    setTotalWasted(wasted);
    setLoading(false);
  }, [nodes]);

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
              🔍 Duplicate File Finder
            </h2>
            <p style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>
              Analyzing loaded files for duplicates
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
            Scanning for duplicates...
          </div>
        ) : (
          <>
            {/* Summary */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px', marginBottom: '20px',
            }}>
              {[
                { label: 'Duplicate Groups', value: duplicates.length, icon: '📋', color: '#FF9800' },
                { label: 'Duplicate Files', value: duplicates.reduce((s, d) => s + d.count, 0), icon: '📄', color: '#F44336' },
                { label: 'Space Wasted', value: formatSize(totalWasted), icon: '💾', color: '#9C27B0' },
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

            {/* Note */}
            <div style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: '8px', padding: '10px 14px',
              marginBottom: '16px', fontSize: '12px', color: '#666',
            }}>
              💡 Showing duplicates from currently loaded folders.
              Expand more folders to find more duplicates.
            </div>

            {/* Duplicate List */}
            {duplicates.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '40px',
                color: '#555', fontSize: '14px',
              }}>
                ✅ No duplicates found in loaded files!
                <br />
                <small>Try expanding more folders first</small>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {duplicates.map((group, i) => {
                  const fileType = getFileType(group.files[0]?.extension);
                  const icon = getCategoryIcon(fileType.category);
                  return (
                    <div key={i} style={{
                      background: '#1a1a1a', borderRadius: '8px',
                      border: '1px solid #2a2a2a', overflow: 'hidden',
                    }}>
                      {/* Group Header */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 14px',
                        borderBottom: '1px solid #222',
                        background: '#161616',
                      }}>
                        <span style={{ fontSize: '16px' }}>{icon}</span>
                        <span style={{ fontSize: '13px', color: '#ccc', fontWeight: 500 }}>
                          {group.name}
                        </span>
                        <span style={{
                          marginLeft: 'auto', fontSize: '11px',
                          padding: '2px 8px', borderRadius: '10px',
                          background: '#F4433622', color: '#F44336',
                        }}>
                          {group.count} copies
                        </span>
                      </div>

                      {/* File instances */}
                      {group.files.slice(0, 3).map((f, j) => (
                        <div key={j} style={{
                          display: 'flex', alignItems: 'center',
                          padding: '7px 14px 7px 32px', gap: '8px',
                          borderBottom: j < group.files.length - 1 ? '1px solid #1e1e1e' : 'none',
                        }}>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{
                              fontSize: '11px', color: '#555',
                              overflow: 'hidden', textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {f.path}
                            </div>
                          </div>
                          <span style={{ fontSize: '11px', color: '#666' }}>
                            {formatSize(f.size)}
                          </span>
                        </div>
                      ))}
                      {group.files.length > 3 && (
                        <div style={{ padding: '6px 14px', fontSize: '11px', color: '#555' }}>
                          +{group.files.length - 3} more locations
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
  width: '680px',
  maxWidth: '95vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
};

export default DuplicateFinder;