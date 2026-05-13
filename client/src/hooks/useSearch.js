// client/src/hooks/useSearch.js

import { useEffect, useCallback, useRef } from 'react';
import { searchFiles } from '../services/api.js';
import useUIStore from '../store/uiStore.js';
import useFileTreeStore from '../store/fileTreeStore.js';
import config from '../constants/config.js';

const useSearch = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching,
    clearSearch,
    selectNode,
    toggleExpanded,
    expandedIds,
  } = useUIStore();

  const { loadChildren, nodes } = useFileTreeStore();
  const debounceRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Clear previous debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchFiles(
          searchQuery,
          '',
          config.SEARCH.MAX_RESULTS
        );
        setSearchResults(data.results || []);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, config.SEARCH.DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  // Jump to a file in the tree when clicked from search results
  const jumpToNode = useCallback(async (node) => {
    selectNode(node.id);
    clearSearch();

    // Build path from node up to root and expand each folder
    const pathParts = node.path.split('/').filter(Boolean);
    let currentNodes = nodes;

    // Load and expand each folder in path
    for (const part of pathParts) {
      const found = Object.values(currentNodes).find(
        n => n.name === part && n.type === 'folder'
      );
      if (found) {
        if (!expandedIds.has(found.id)) {
          toggleExpanded(found.id);
          await loadChildren(found.id);
        }
      }
    }
  }, [nodes, expandedIds, selectNode, clearSearch, toggleExpanded, loadChildren]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch,
    jumpToNode,
  };
};

export default useSearch;