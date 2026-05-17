import { useState } from 'react';
import config from '../../constants/config.js';
import Spinner from '../UI/Spinner.jsx';

const PerformanceAnalyzer = ({ onClose }) => {
  const [files, setFiles] = useState(50000);
  const [depth, setDepth] = useState(5);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runBenchmark = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(`${config.API_BASE_URL}/benchmark?files=${files}&depth=${depth}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP error ${res.status}`);
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(20, 20, 20, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        width: '100%', maxWidth: '700px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '18px', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> Serialization Benchmark
          </h2>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px'
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#aaa', lineHeight: 1.5 }}>
              Configure the parameters below to dynamically generate a massive file system in memory. 
              The backend will race standard <strong>JSON</strong> against <strong>Binary MessagePack</strong> to prove the performance difference.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                  Number of Files: <strong style={{ color: '#fff' }}>{files.toLocaleString()}</strong>
                </label>
                <input 
                  type="range" min="1000" max="200000" step="1000" 
                  value={files} onChange={e => setFiles(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#61dafb' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                  Nesting Depth: <strong style={{ color: '#fff' }}>{depth} Levels</strong>
                </label>
                <input 
                  type="range" min="1" max="10" step="1" 
                  value={depth} onChange={e => setDepth(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#61dafb' }}
                />
              </div>
            </div>

            <button 
              onClick={runBenchmark}
              disabled={loading}
              style={{
                marginTop: '20px', width: '100%', padding: '12px',
                background: loading ? '#333' : '#61dafb',
                color: loading ? '#888' : '#000',
                border: 'none', borderRadius: '8px',
                fontWeight: 600, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {loading ? <Spinner size={16} /> : '🚀 Run Live Benchmark'}
            </button>
            {error && <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>Error: {error}</p>}
          </div>

          {/* Results Area */}
          {results && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ fontSize: '14px', color: '#fff', marginBottom: '16px', textAlign: 'center' }}>
                Generated <span style={{ color: '#61dafb' }}>{results.parameters.totalNodes.toLocaleString()} total nodes</span> in {results.generationTimeMs}ms
              </h3>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {/* JSON Card */}
                <div style={{
                  flex: 1, minWidth: '250px',
                  background: 'rgba(255, 107, 107, 0.05)',
                  border: '1px solid rgba(255, 107, 107, 0.2)',
                  borderRadius: '12px', padding: '20px'
                }}>
                  <h4 style={{ margin: '0 0 16px 0', color: '#ff6b6b', fontSize: '16px', textAlign: 'center' }}>{`{ JSON }`}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>Payload Size</span>
                      <strong style={{ color: '#fff', fontSize: '14px' }}>{results.json.sizeMB} MB</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>Serialize (Write)</span>
                      <strong style={{ color: '#fff', fontSize: '14px' }}>{results.json.serializeTimeMs} ms</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>Deserialize (Read)</span>
                      <strong style={{ color: '#fff', fontSize: '14px' }}>{results.json.deserializeTimeMs} ms</strong>
                    </div>
                  </div>
                </div>

                {/* Binary Card */}
                <div style={{
                  flex: 1, minWidth: '250px',
                  background: 'rgba(97, 218, 251, 0.05)',
                  border: '1px solid rgba(97, 218, 251, 0.2)',
                  borderRadius: '12px', padding: '20px',
                  boxShadow: '0 0 20px rgba(97, 218, 251, 0.1)'
                }}>
                  <h4 style={{ margin: '0 0 16px 0', color: '#61dafb', fontSize: '16px', textAlign: 'center' }}>[ Binary MessagePack ]</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>Payload Size</span>
                      <strong style={{ color: '#fff', fontSize: '14px' }}>{results.binary.sizeMB} MB</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>Serialize (Write)</span>
                      <strong style={{ color: '#fff', fontSize: '14px' }}>{results.binary.serializeTimeMs} ms</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>Deserialize (Read)</span>
                      <strong style={{ color: '#fff', fontSize: '14px' }}>{results.binary.deserializeTimeMs} ms</strong>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Conclusion */}
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(0,255,100,0.05)', border: '1px solid rgba(0,255,100,0.2)', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ color: '#00ff66', fontSize: '14px', fontWeight: 600 }}>
                  Binary is {((results.json.sizeMB - results.binary.sizeMB) / results.json.sizeMB * 100).toFixed(0)}% smaller!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyzer;
