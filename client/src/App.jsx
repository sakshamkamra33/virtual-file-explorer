// client/src/App.jsx

import { useState, useEffect } from 'react';
import FileTree from './components/FileTree/FileTree.jsx';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import FileDetails from './components/FileDetails/FileDetails.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import DuplicateFinder from './components/Dashboard/DuplicateFinder.jsx';
import StorageCleaner from './components/Dashboard/StorageCleaner.jsx';
import useUIStore from './store/uiStore.js';

const App = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [showCleaner, setShowCleaner] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // Responsive states
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 800);
  
  const { selectedId } = useUIStore();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 800;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar on mobile when a file is selected for better UX
  useEffect(() => {
    if (isMobile && selectedId) {
      setSidebarOpen(false);
    }
  }, [selectedId, isMobile]);

  const theme = {
    bg:       darkMode ? '#0a0a0a' : '#f8fafc',
    panelBg:  darkMode ? 'rgba(20, 20, 20, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    border:   darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text:     darkMode ? '#f3f4f6' : '#111827',
    subtext:  darkMode ? '#9ca3af' : '#6b7280',
    inputBg:  darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      background: theme.bg, color: theme.text,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflow: 'hidden', transition: 'background 0.3s ease',
      position: 'relative'
    }}>
      {/* Decorative Background Glows for premium FAANG aesthetic */}
      <div className="glow-blob top-left"></div>
      <div className="glow-blob bottom-right"></div>

      {/* Modals */}
      {showDashboard  && <Dashboard onClose={() => setShowDashboard(false)} />}
      {showDuplicates && <DuplicateFinder onClose={() => setShowDuplicates(false)} />}
      {showCleaner    && <StorageCleaner onClose={() => setShowCleaner(false)} />}

      {/* Left Panel (Sidebar) */}
      <div 
        className={`sidebar ${sidebarOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}
        style={{
          width: isMobile ? '100%' : '380px', minWidth: '320px',
          display: 'flex', flexDirection: 'column',
          borderRight: `1px solid ${theme.border}`,
          background: theme.panelBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 10,
          position: isMobile ? 'absolute' : 'relative',
          height: '100%',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: (isMobile && !sidebarOpen) ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 16px 12px',
          borderBottom: `1px solid ${theme.border}`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '8px', marginBottom: '16px', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '20px' }}>📱</span>
            <span style={{ 
              fontSize: '17px', fontWeight: 700, letterSpacing: '-0.3px',
              color: darkMode ? '#fff' : '#111' 
            }}>
              File Explorer
            </span>
            <span className="live-badge">LIVE</span>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme" style={{ background: theme.inputBg, borderColor: theme.border, color: theme.text }}>
                {darkMode ? '☀️' : '🌙'}
              </button>
              
              {!isMobile && (
                <>
                  <button className="action-btn" onClick={() => setShowCleaner(true)} style={{ background: theme.inputBg, borderColor: theme.border, color: theme.text }}>
                    🧹 Clean
                  </button>
                  <button className="action-btn" onClick={() => setShowDashboard(true)} style={{ background: theme.inputBg, borderColor: theme.border, color: theme.text }}>
                    📊 Stats
                  </button>
                </>
              )}
            </div>
          </div>
          <SearchBar />
          
          {/* Mobile specific quick actions */}
          {isMobile && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="action-btn" onClick={() => setShowCleaner(true)} style={{ flex: 1, background: theme.inputBg, borderColor: theme.border, color: theme.text }}>🧹 Clean</button>
              <button className="action-btn" onClick={() => setShowDuplicates(true)} style={{ flex: 1, background: theme.inputBg, borderColor: theme.border, color: theme.text }}>🔍 Dupes</button>
              <button className="action-btn" onClick={() => setShowDashboard(true)} style={{ flex: 1, background: theme.inputBg, borderColor: theme.border, color: theme.text }}>📊 Stats</button>
            </div>
          )}
        </div>

        {/* Tree List */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <FileTree />
        </div>
      </div>

      {/* Right Panel (File Details Content) */}
      <div style={{ 
        flex: 1, overflow: 'hidden', 
        background: 'transparent',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Mobile Header Toggle */}
        {isMobile && (
          <div style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${theme.border}`,
            background: theme.panelBg,
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <button 
              onClick={() => setSidebarOpen(true)}
              style={{
                background: theme.inputBg, border: `1px solid ${theme.border}`, 
                color: theme.text, fontSize: '16px', cursor: 'pointer', 
                padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center'
              }}
            >
              ☰ Menu
            </button>
            <span style={{ fontWeight: 600, fontSize: '15px' }}>Details</span>
          </div>
        )}
        <FileDetails />
      </div>
    </div>
  );
};

export default App;