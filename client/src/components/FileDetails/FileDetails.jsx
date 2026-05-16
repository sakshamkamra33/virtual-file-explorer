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
      background: 'transparent', // Let the glow show through
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
          padding: '32px 24px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ fontSize: '72px', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' }}>{icon}</span>
          <div style={{
            fontSize: '20px',
            color: '#fff',
            fontWeight: 700,
            textAlign: 'center',
            wordBreak: 'break-all',
            letterSpacing: '-0.5px'
          }}>
            {node.name}
          </div>
          {fileType && (
            <span style={{
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: fileType.color + '22',
              color: fileType.color,
              fontWeight: 600,
              border: `1px solid ${fileType.color}44`
            }}>
              {fileType.label}
            </span>
          )}
          {isFolder && (
            <span style={{
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(97, 218, 251, 0.1)',
              color: '#61dafb',
              fontWeight: 600,
              border: '1px solid rgba(97, 218, 251, 0.2)'
            }}>
              Folder • {node.children?.length || 0} items
            </span>
          )}
        </div>

        {/* Details table */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.05)',
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
              padding: '14px 18px',
              borderBottom: i !== 5 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              gap: '12px',
            }}>
              <span style={{
                fontSize: '13px',
                color: '#888',
                minWidth: '90px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {item.label}
              </span>
              <span style={{
                fontSize: '13px',
                color: '#e0e0e0',
                wordBreak: 'break-all',
                fontWeight: 500
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