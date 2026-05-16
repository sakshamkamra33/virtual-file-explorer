// client/src/components/FileTree/FileTree.jsx

import { useEffect, useMemo, useState } from 'react';
import useFileTreeStore from '../../store/fileTreeStore.js';
import useUIStore from '../../store/uiStore.js';
import useFileTree from '../../hooks/useFileTree.js';
import VirtualList from './VirtualList.jsx';
import Spinner from '../UI/Spinner.jsx';

const FILTERS = [
  { label: 'All',      value: 'all',      icon: '📱' },
  { label: 'Images',   value: 'image',    icon: '🖼️' },
  { label: 'Videos',   value: 'video',    icon: '🎬' },
  { label: 'Audio',    value: 'audio',    icon: '🎵' },
  { label: 'Docs',     value: 'document', icon: '📄' },
  { label: 'Apps',     value: 'app',      icon: '📦' },
  { label: 'Archives', value: 'archive',  icon: '🗜️' },
];

const CATEGORY_EXTS = {
  image:    ['jpg','jpeg','png','gif','webp','bmp'],
  video:    ['mp4','mkv','avi','mov','wmv'],
  audio:    ['mp3','wav','flac','ogg','opus','m3u'],
  document: ['pdf','docx','xlsx','pptx','txt','epub'],
  app:      ['apk','obb'],
  archive:  ['zip','rar','torrent'],
};

const SORTS = [
  { label: 'Name A-Z',   value: 'name_asc' },
  { label: 'Name Z-A',   value: 'name_desc' },
  { label: 'Size ↑',     value: 'size_asc' },
  { label: 'Size ↓',     value: 'size_desc' },
  { label: 'Date ↑',     value: 'date_asc' },
  { label: 'Date ↓',     value: 'date_desc' },
];

// Get sorted and filtered children for a specific folder
const getSortedChildren = (node, nodes, filter, sort) => {
  if (!node || !node.children) return [];
  
  const exts = CATEGORY_EXTS[filter] || [];
  
  // Map IDs to node objects and apply filter
  let childrenNodes = node.children
    .map(id => nodes[id])
    .filter(Boolean)
    .filter(n => {
      if (filter === 'all') return true;
      if (n.type === 'folder') return true; // Keep folders so user can navigate
      return exts.includes(n.extension || '');
    });

  // Sort the children locally within this folder
  return childrenNodes.sort((a, b) => {
    // 1. Always pin "Internal Storage" to the very top (only applies at root level)
    if (a.name === 'Internal Storage' && b.name !== 'Internal Storage') return -1;
    if (b.name === 'Internal Storage' && a.name !== 'Internal Storage') return 1;

    // 2. Folders always go above files
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;

    // 3. User selected sorting
    switch (sort) {
      case 'name_asc':  return a.name.localeCompare(b.name);
      case 'name_desc': return b.name.localeCompare(a.name);
      case 'size_asc':  return (a.size || 0) - (b.size || 0);
      case 'size_desc': return (b.size || 0) - (a.size || 0);
      case 'date_asc':  return new Date(a.lastModified || 0) - new Date(b.lastModified || 0);
      case 'date_desc': return new Date(b.lastModified || 0) - new Date(a.lastModified || 0);
      default: return 0;
    }
  });
};

// Recursively build the flattened array for the UI, respecting folder sorting
const buildFlatTree = (nodeId, nodes, expandedIds, filter, sort, depth = 0) => {
  const node = nodes[nodeId];
  if (!node) return [];

  const result = [];
  
  // Don't render the artificial "root" container
  if (nodeId !== 'root') {
    result.push({ ...node, _depth: depth });
  }

  // If folder is expanded (or is the root), process its children
  const isExpanded = nodeId === 'root' || expandedIds.has(node.id);
  if (node.type === 'folder' && isExpanded) {
    const sortedChildren = getSortedChildren(node, nodes, filter, sort);
    const childDepth = nodeId === 'root' ? 0 : depth + 1;
    
    for (const child of sortedChildren) {
      result.push(...buildFlatTree(child.id, nodes, expandedIds, filter, sort, childDepth));
    }
  }

  return result;
};

const FileTree = () => {
  const { loadRoot, error } = useFileTreeStore();
  const { expandedIds } = useUIStore();
  const {
    nodes, selectedId,
    handleFolderClick, handleFileClick,
    isExpanded, isFolderLoading,
  } = useFileTree();

  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('name_asc');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => { loadRoot(); }, []);

  const flatNodes = useMemo(() => {
    if (!nodes['root']) return [];
    // Correctly build the flat list by sorting folders individually before combining
    return buildFlatTree('root', nodes, expandedIds, activeFilter, activeSort);
  }, [nodes, expandedIds, activeFilter, activeSort]);

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#f44336', fontSize: '13px' }}>
        ❌ Error: {error}
        <br />
        <small style={{ color: '#666' }}>Make sure server is running on port 5000</small>
      </div>
    );
  }

  if (!nodes['root']) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '10px', height: '100%', color: '#666', fontSize: '13px' }}>
        <Spinner size={16} /> Loading file system...
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '4px', padding: '8px 10px',
        borderBottom: '1px solid #2a2a2a', overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: '20px', border: 'none',
              cursor: 'pointer', fontSize: '11px', whiteSpace: 'nowrap',
              fontWeight: activeFilter === f.value ? 600 : 400,
              background: activeFilter === f.value ? '#61dafb22' : '#1e1e1e',
              color: activeFilter === f.value ? '#61dafb' : '#666',
              outline: activeFilter === f.value ? '1px solid #61dafb44' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Sort + Count Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '5px 10px', borderBottom: '1px solid #2a2a2a',
        position: 'relative',
      }}>
        <span style={{ fontSize: '11px', color: '#555' }}>
          {flatNodes.length} items
        </span>

        {/* Sort Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowSort(!showSort)}
            style={{
              background: '#1e1e1e', border: '1px solid #333',
              color: '#888', padding: '3px 8px', borderRadius: '4px',
              cursor: 'pointer', fontSize: '11px', display: 'flex',
              alignItems: 'center', gap: '4px',
            }}
          >
            ↕ {SORTS.find(s => s.value === activeSort)?.label}
          </button>

          {showSort && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: '4px',
              background: '#1a1a1a', border: '1px solid #333',
              borderRadius: '6px', zIndex: 50, minWidth: '120px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}>
              {SORTS.map(s => (
                <div
                  key={s.value}
                  onClick={() => { setActiveSort(s.value); setShowSort(false); }}
                  style={{
                    padding: '7px 12px', fontSize: '12px', cursor: 'pointer',
                    color: activeSort === s.value ? '#61dafb' : '#aaa',
                    background: activeSort === s.value ? '#61dafb11' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#222'}
                  onMouseLeave={e => e.currentTarget.style.background =
                    activeSort === s.value ? '#61dafb11' : 'transparent'}
                >
                  {s.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Virtual Tree */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <VirtualList
          flatNodes={flatNodes}
          selectedId={selectedId}
          onFolderClick={handleFolderClick}
          onFileClick={handleFileClick}
          isExpanded={isExpanded}
          isFolderLoading={isFolderLoading}
        />
      </div>
    </div>
  );
};

export default FileTree;