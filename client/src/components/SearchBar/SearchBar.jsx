// client/src/components/SearchBar/SearchBar.jsx

import useSearch from '../../hooks/useSearch.js';
import { getFileType, getCategoryIcon } from '../../utils/fileTypeMap.js';
import { formatSize } from '../../utils/formatSize.js';
import Spinner from '../UI/Spinner.jsx';

const SearchBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch,
    jumpToNode,
  } = useSearch();

  return (
    <div style={{ position: 'relative', padding: '8px 12px' }}>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#1e1e1e',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '6px 10px',
      }}>
        <span style={{ color: '#555', fontSize: '13px' }}>🔍</span>
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ccc',
            fontSize: '13px',
          }}
        />
        {isSearching && <Spinner size={13} />}
        {searchQuery && !isSearching && (
          <span
            onClick={clearSearch}
            style={{ color: '#555', cursor: 'pointer', fontSize: '13px' }}
          >
            ✕
          </span>
        )}
      </div>

      {/* Search Results Dropdown */}
      {searchQuery && searchResults.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '12px',
          right: '12px',
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '6px',
          zIndex: 100,
          maxHeight: '320px',
          overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          {/* Results header */}
          <div style={{
            padding: '6px 12px',
            fontSize: '11px',
            color: '#555',
            borderBottom: '1px solid #222',
          }}>
            {searchResults.length} results for "{searchQuery}"
          </div>

          {/* Result items */}
          {searchResults.map(node => {
            const fileType = node.type === 'file'
              ? getFileType(node.extension)
              : { color: '#61dafb', category: 'folder' };
            const icon = node.type === 'folder'
              ? '📁'
              : getCategoryIcon(fileType.category);

            return (
              <div
                key={node.id}
                onClick={() => jumpToNode(node)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #1e1e1e',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#222'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '14px' }}>{icon}</span>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  {/* File name */}
                  <div style={{
                    fontSize: '13px',
                    color: '#ccc',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {node.name}
                  </div>
                  {/* File path */}
                  <div style={{
                    fontSize: '11px',
                    color: '#555',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {node.path}
                  </div>
                </div>
                {/* Size */}
                {node.size && (
                  <span style={{ fontSize: '11px', color: '#555' }}>
                    {formatSize(node.size)}
                  </span>
                )}
                {/* Extension badge */}
                {node.extension && (
                  <span style={{
                    fontSize: '10px',
                    padding: '1px 5px',
                    borderRadius: '3px',
                    background: fileType.color + '22',
                    color: fileType.color,
                  }}>
                    {node.extension.toUpperCase()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* No results */}
      {searchQuery && !isSearching && searchResults.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '12px',
          right: '12px',
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '6px',
          padding: '16px',
          textAlign: 'center',
          color: '#555',
          fontSize: '13px',
          zIndex: 100,
        }}>
          No files found for "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;