// client/src/services/api.js

import config from '../constants/config.js';

const BASE = config.API_BASE_URL;

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP error ${res.status}`);
  }
  return res.json();
};

// Fetch root level folders
export const fetchRoot = async () => {
  const res = await fetch(`${BASE}${config.ENDPOINTS.ROOT}`);
  return handleResponse(res);
};

// Fetch children of a folder by id
export const fetchChildren = async (id) => {
  const res = await fetch(`${BASE}${config.ENDPOINTS.FILES}?id=${id}`);
  return handleResponse(res);
};

// Search files
export const searchFiles = async (query, type = '', limit = 50) => {
  const params = new URLSearchParams({ q: query, limit });
  if (type) params.append('type', type);
  const res = await fetch(`${BASE}${config.ENDPOINTS.SEARCH}?${params}`);
  return handleResponse(res);
};

// Fetch stats
export const fetchStats = async () => {
  const res = await fetch(`${BASE}${config.ENDPOINTS.STATS}`);
  return handleResponse(res);
};