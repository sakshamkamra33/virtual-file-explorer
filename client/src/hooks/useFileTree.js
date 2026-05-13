// client/src/hooks/useFileTree.js

import { useCallback } from 'react';
import useFileTreeStore from '../store/fileTreeStore.js';
import useUIStore from '../store/uiStore.js';

const useFileTree = () => {
  const { nodes, loadChildren, isLoading, error } = useFileTreeStore();
  const { expandedIds, toggleExpanded, selectNode, selectedId } = useUIStore();

  // Handle folder click — toggle expand and load children
  const handleFolderClick = useCallback(async (folder) => {
    const isCurrentlyExpanded = expandedIds.has(folder.id);

    // Toggle UI immediately
    toggleExpanded(folder.id);
    selectNode(folder.id);

    // Load children if expanding
    if (!isCurrentlyExpanded) {
      await loadChildren(folder.id);
    }
  }, [expandedIds, toggleExpanded, selectNode, loadChildren]);

  // Handle file click — just select it
  const handleFileClick = useCallback((file) => {
    selectNode(file.id);
  }, [selectNode]);

  // Get children of a folder from the store
  const getChildren = useCallback((folderId) => {
    const folder = nodes[folderId];
    if (!folder || !folder.children) return [];
    return folder.children.map(id => nodes[id]).filter(Boolean);
  }, [nodes]);

  // Check if folder is expanded
  const isExpanded = useCallback((id) => {
    return expandedIds.has(id);
  }, [expandedIds]);

  // Check if folder is loading
  const isFolderLoading = useCallback((id) => {
    return isLoading(id);
  }, [isLoading]);

  return {
    nodes,
    error,
    selectedId,
    handleFolderClick,
    handleFileClick,
    getChildren,
    isExpanded,
    isFolderLoading,
  };
};

export default useFileTree;