// server/routes/search.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load data once into memory
const dataPath = path.resolve(__dirname, '../data/fileTree.json');
const fileTree = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Pre-build search index (array of all nodes) once at startup
const searchIndex = Object.values(fileTree);

// GET /api/search?q=resume
// GET /api/search?q=resume&type=pdf
// GET /api/search?q=resume&type=pdf&limit=20
export const searchFiles = (req, res) => {
  try {
    const { q, type, limit = 50 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    const query = q.trim().toLowerCase();

    let results = searchIndex.filter(node => {
      // Match by name
      const nameMatch = node.name.toLowerCase().includes(query);

      // Match by extension if type filter provided
      const typeMatch = type ? node.extension === type : true;

      return nameMatch && typeMatch;
    });

    // Sort — exact matches first, then partial
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === query;
      const bExact = b.name.toLowerCase() === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.name.localeCompare(b.name);
    });

    // Limit results
    results = results.slice(0, parseInt(limit));

    return res.json({
      query: q,
      total: results.length,
      results,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};