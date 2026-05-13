// client/src/constants/config.js

const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'https://file-explorer-api.onrender.com/api',
  ENDPOINTS: {
    ROOT: '/files/root',
    FILES: '/files',
    SEARCH: '/search',
    STATS: '/stats',
    HEALTH: '/health',
  },
  VIRTUAL_SCROLL: {
    ITEM_HEIGHT: 36,
    OVERSCAN: 10,
  },
  SEARCH: {
    DEBOUNCE_MS: 300,
    MAX_RESULTS: 50,
  },
};

export default config;