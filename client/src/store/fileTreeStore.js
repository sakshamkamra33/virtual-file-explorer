// client/src/store/fileTreeStore.js

import { create } from 'zustand';
import { fetchRoot, fetchChildren } from '../services/api.js';

const useFileTreeStore = create((set, get) => ({
  // Flat map of all loaded nodes
  nodes: {},

  // Loading states per folder id
  loadingIds: new Set(),

  // Error state
  error: null,

  // Initial load — fetch root
  loadRoot: async () => {
    try {
      set({ error: null });
      const data = await fetchRoot();

      const newNodes = {};
      newNodes[data.node.id] = data.node;
      data.children.forEach(child => {
        newNodes[child.id] = child;
      });

      set({ nodes: newNodes });
    } catch (err) {
      set({ error: err.message });
    }
  },

  // Load children of a folder when expanded
  loadChildren: async (folderId) => {
    const { nodes, loadingIds } = get();

    // Already loading
    if (loadingIds.has(folderId)) return;

    // Already loaded
    const node = nodes[folderId];
    if (node && Array.isArray(node.children) && node.children.length > 0) {
      const firstChildId = node.children[0];
      if (nodes[firstChildId]) return; // children already in store
    }

    try {
      // Mark as loading
      set(state => ({
        loadingIds: new Set([...state.loadingIds, folderId]),
        error: null,
      }));

      const data = await fetchChildren(folderId);

      // Add all children to flat map
      const newNodes = { ...get().nodes };
      newNodes[data.node.id] = data.node;
      data.children.forEach(child => {
        newNodes[child.id] = child;
      });

      set(state => {
        const newLoadingIds = new Set(state.loadingIds);
        newLoadingIds.delete(folderId);
        return { nodes: newNodes, loadingIds: newLoadingIds };
      });

    } catch (err) {
      set(state => {
        const newLoadingIds = new Set(state.loadingIds);
        newLoadingIds.delete(folderId);
        return { error: err.message, loadingIds: newLoadingIds };
      });
    }
  },

  // Get children nodes of a folder
  getChildren: (folderId) => {
    const { nodes } = get();
    const folder = nodes[folderId];
    if (!folder || !folder.children) return [];
    return folder.children.map(id => nodes[id]).filter(Boolean);
  },

  // Check if folder is loading
  isLoading: (folderId) => {
    return get().loadingIds.has(folderId);
  },
}));

export default useFileTreeStore;