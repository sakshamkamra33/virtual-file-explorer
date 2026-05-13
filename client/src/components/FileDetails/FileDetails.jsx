// client/src/components/FileDetails/FileDetails.jsx

import useUIStore from '../../store/uiStore.js';
import useFileTreeStore from '../../store/fileTreeStore.js';
import { getFileType, getCategoryIcon } from '../../utils/fileTypeMap.js';
import { formatSize } from '../../utils/formatSize.js';
import Breadcrumb from '../UI/Breadcrumb.jsx';

const FileDetails = () => {
  const { selectedId } = useUIStore();
  const { nodes } = useFileTreeStore();

  const node = selectedId ? nodes[selectedId] : null;

  if (!node) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#444',
        gap: '12px',
      }}>
        <span style={{ fontSize: '48px' }}>📱</span>
        <p style={{ fontSize: '14px' }}>Select a file or folder to see details</p>
      </div>
    );
  }

  const isFolder = node.type === 'folder';
  const fileType = !isFolder ? getFileType(node.extension) : null;
  const icon = isFolder
    ? '📁'
    : getCategoryIcon(fileType?.category);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#111',
    }}>
      {/* Breadcrumb */}
      <Breadcrumb path={node.path} />

      {/* Main content */}
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        {/* Big icon + name */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
          padding: '24px',
          background: '#1a1a1a',
          borderRadius: '12px',
          border: '1px solid #2a2a2a',
        }}>
          <span style={{ fontSize: '64px' }}>{icon}</span>
          <div style={{
            fontSize: '16px',
            color: '#fff',
            fontWeight: 600,
            textAlign: 'center',
            wordBreak: 'break-all',
          }}>
            {node.name}
          </div>
          {fileType && (
            <span style={{
              fontSize: '12px',
              padding: '3px 10px',
              borderRadius: '12px',
              background: fileType.color + '22',
              color: fileType.color,
              fontWeight: 500,
            }}>
              {fileType.label}
            </span>
          )}
          {isFolder && (
            <span style={{
              fontSize: '12px',
              padding: '3px 10px',
              borderRadius: '12px',
              background: '#61dafb22',
              color: '#61dafb',
            }}>
              Folder • {node.children?.length || 0} items
            </span>
          )}
        </div>

        {/* Details table */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          background: '#2a2a2a',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #2a2a2a',
        }}>
          {[
            { label: 'Name', value: node.name },
            { label: 'Type', value: isFolder ? 'Folder' : fileType?.label },
            { label: 'Path', value: node.path },
            !isFolder && { label: 'Size', value: formatSize(node.size) },
            !isFolder && { label: 'Extension', value: node.extension?.toUpperCase() },
            { label: 'Modified', value: node.lastModified ? new Date(node.lastModified).toLocaleString() : '--' },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              background: i % 2 === 0 ? '#161616' : '#1a1a1a',
              padding: '10px 14px',
              gap: '12px',
            }}>
              <span style={{
                fontSize: '12px',
                color: '#555',
                minWidth: '80px',
                fontWeight: 500,
              }}>
                {item.label}
              </span>
              <span style={{
                fontSize: '12px',
                color: '#aaa',
                wordBreak: 'break-all',
              }}>
                {item.value || '--'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileDetails;