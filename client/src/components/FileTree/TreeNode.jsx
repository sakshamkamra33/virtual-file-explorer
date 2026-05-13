// client/src/components/FileTree/TreeNode.jsx

import Icon from '../UI/Icon.jsx';
import Spinner from '../UI/Spinner.jsx';
import { formatSize } from '../../utils/formatSize.js';
import { getFileType } from '../../utils/fileTypeMap.js';

const TreeNode = ({
  node,
  depth,
  isExpanded,
  isLoading,
  isSelected,
  onFolderClick,
  onFileClick,
}) => {
  const isFolder = node.type === 'folder';
  const indent = depth * 16;

  const handleClick = () => {
    if (isFolder) {
      onFolderClick(node);
    } else {
      onFileClick(node);
    }
  };

  const fileType = !isFolder ? getFileType(node.extension) : null;

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        paddingLeft: `${indent + 8}px`,
        cursor: 'pointer',
        backgroundColor: isSelected ? '#2a4a6b' : 'transparent',
        borderLeft: isSelected ? '2px solid #61dafb' : '2px solid transparent',
        userSelect: 'none',
        height: '36px',
        boxSizing: 'border-box',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => {
        if (!isSelected) e.currentTarget.style.backgroundColor = '#1e1e1e';
      }}
      onMouseLeave={e => {
        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* Expand arrow for folders */}
      {isFolder && (
        <span style={{
          fontSize: '10px',
          color: '#666',
          width: '12px',
          display: 'inline-block',
          transition: 'transform 0.15s',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>
          ▶
        </span>
      )}

      {/* Spacer for files */}
      {!isFolder && <span style={{ width: '12px' }} />}

      {/* Icon */}
      {isLoading
        ? <Spinner size={14} />
        : <Icon node={node} size={15} />
      }

      {/* Name */}
      <span style={{
        fontSize: '13px',
        color: isFolder ? '#61dafb' : '#ccc',
        fontWeight: isFolder ? 500 : 400,
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {node.name}
      </span>

      {/* File size */}
      {!isFolder && node.size && (
        <span style={{
          fontSize: '11px',
          color: '#555',
          minWidth: '50px',
          textAlign: 'right',
        }}>
          {formatSize(node.size)}
        </span>
      )}

      {/* File type badge */}
      {!isFolder && fileType && (
        <span style={{
          fontSize: '10px',
          padding: '1px 5px',
          borderRadius: '3px',
          backgroundColor: fileType.color + '22',
          color: fileType.color,
          minWidth: '32px',
          textAlign: 'center',
        }}>
          {node.extension?.toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default TreeNode;