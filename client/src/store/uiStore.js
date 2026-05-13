// client/src/store/uiStore.js

import { create } from 'zustand';

const useUIStore = create((set, get) => ({
  // Set of expanded folder ids
  expandedIds: new Set(['root']),

  // Currently selected file/folder id
  selectedId: null,

  // Search query
  searchQuery: '',

  // Search results
  searchResults: [],

  // Is search active
  isSearching: false,

  // Stats panel open
  statsOpen: false,

  // Toggle folder open/close
  toggleExpanded: (id) => {
    set(state => {
      const newExpanded = new Set(state.expandedIds);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return { expandedIds: newExpanded };
    });
  },

  // Check if folder is expanded
  isExpanded: (id) => {
    return get().expandedIds.has(id);
  },

  // Select a file or folder
  selectNode: (id) => {
    set({ selectedId: id });
  },

  // Set search query
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // Set search results
  setSearchResults: (results) => {
    set({ searchResults: results });
  },

  // Set searching state
  setIsSearching: (val) => {
    set({ isSearching: val });
  },

  // Toggle stats panel
  toggleStats: () => {
    set(state => ({ statsOpen: !state.statsOpen }));
  },

  // Clear search
  clearSearch: () => {
    set({ searchQuery: '', searchResults: [], isSearching: false });
  },
}));

export default useUIStore;