// client/src/constants/config.js

const config = {
  API_BASE_URL: 'http://localhost:5000/api',
  ENDPOINTS: {
    ROOT: '/files/root',
    FILES: '/files',
    SEARCH: '/search',
    STATS: '/stats',
    HEALTH: '/health',
  },
  VIRTUAL_SCROLL: {
    ITEM_HEIGHT: 36,        // height of each row in px
    OVERSCAN: 10,           // extra rows rendered above/below viewport
  },
  SEARCH: {
    DEBOUNCE_MS: 300,       // wait 300ms after typing before searching
    MAX_RESULTS: 50,
  },
};

export default config;