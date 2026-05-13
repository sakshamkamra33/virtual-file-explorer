// client/src/components/FileTree/VirtualList.jsx

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import TreeNode from './TreeNode.jsx';
import config from '../../constants/config.js';

const VirtualList = ({
  flatNodes,
  selectedId,
  onFolderClick,
  onFileClick,
  isExpanded,
  isFolderLoading,
}) => {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: flatNodes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => config.VIRTUAL_SCROLL.ITEM_HEIGHT,
    overscan: config.VIRTUAL_SCROLL.OVERSCAN,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: '100%',
        overflow: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#333 #111',
      }}
    >
      {/* Total height container */}
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualItem => {
          const node = flatNodes[virtualItem.index];
          if (!node) return null;

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TreeNode
                node={node}
                depth={node._depth || 0}
                isExpanded={isExpanded(node.id)}
                isLoading={isFolderLoading(node.id)}
                isSelected={selectedId === node.id}
                onFolderClick={onFolderClick}
                onFileClick={onFileClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualList;