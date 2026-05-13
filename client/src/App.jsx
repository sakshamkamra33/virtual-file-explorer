// client/src/App.jsx

import { useState } from 'react';
import FileTree from './components/FileTree/FileTree.jsx';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import FileDetails from './components/FileDetails/FileDetails.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import DuplicateFinder from './components/Dashboard/DuplicateFinder.jsx';
import StorageCleaner from './components/Dashboard/StorageCleaner.jsx';

const App = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [showCleaner, setShowCleaner] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const theme = {
    bg:       darkMode ? '#111'    : '#f5f5f5',
    panelBg:  darkMode ? '#141414' : '#ffffff',
    border:   darkMode ? '#2a2a2a' : '#e0e0e0',
    text:     darkMode ? '#ccc'    : '#333',
    subtext:  darkMode ? '#666'    : '#888',
    inputBg:  darkMode ? '#1e1e1e' : '#f0f0f0',
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      background: theme.bg, color: theme.text,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflow: 'hidden', transition: 'all 0.2s ease',
    }}>

      {/* Modals */}
      {showDashboard  && <Dashboard onClose={() => setShowDashboard(false)} />}
      {showDuplicates && <DuplicateFinder onClose={() => setShowDuplicates(false)} />}
      {showCleaner    && <StorageCleaner onClose={() => setShowCleaner(false)} />}

      {/* Left Panel */}
      <div style={{
        width: '380px', minWidth: '280px',
        display: 'flex', flexDirection: 'column',
        borderRight: `1px solid ${theme.border}`,
        background: theme.panelBg,
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 12px 8px',
          borderBottom: `1px solid ${theme.border}`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '6px', marginBottom: '10px', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '18px' }}>📱</span>
            <span style={{ fontSize: '14px', fontWeight: 600,
              color: darkMode ? '#fff' : '#111' }}>
              File Explorer
            </span>
            <span style={{
              fontSize: '10px', padding: '2px 7px',
              background: '#61dafb22', color: '#61dafb',
              borderRadius: '10px',
            }}>LIVE</span>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
              {/* Theme Toggle */}
              <button onClick={() => setDarkMode(!darkMode)}
                title="Toggle Theme"
                style={{
                  background: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  color: theme.subtext,
                  width: '30px', height: '30px', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* Cleaner */}
              <button onClick={() => setShowCleaner(true)}
                title="Storage Cleaner"
                style={{
                  background: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  color: theme.subtext,
                  padding: '4px 8px', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '11px',
                  display: 'flex', alignItems: 'center', gap: '3px',
                }}>
                🧹 Clean
              </button>

              {/* Duplicates */}
              <button onClick={() => setShowDuplicates(true)}
                title="Find Duplicates"
                style={{
                  background: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  color: theme.subtext,
                  padding: '4px 8px', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '11px',
                  display: 'flex', alignItems: 'center', gap: '3px',
                }}>
                🔍 Dupes
              </button>

              {/* Stats */}
              <button onClick={() => setShowDashboard(true)}
                title="Storage Analytics"
                style={{
                  background: theme.inputBg,
                  border: `1px solid ${theme.border}`,
                  color: theme.subtext,
                  padding: '4px 8px', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '11px',
                  display: 'flex', alignItems: 'center', gap: '3px',
                }}>
                📊 Stats
              </button>
            </div>
          </div>
          <SearchBar />
        </div>

        {/* Tree */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <FileTree />
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, overflow: 'hidden', background: theme.bg }}>
        <FileDetails />
      </div>
    </div>
  );
};

export default App;