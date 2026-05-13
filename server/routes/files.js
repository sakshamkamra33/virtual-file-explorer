// server/routes/files.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the generated fake data once into memory
const dataPath = path.resolve(__dirname, '../data/fileTree.json');
const fileTree = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// GET /api/files?path=/
// GET /api/files?id=node_1
export const getFiles = (req, res) => {
  try {
    const { id } = req.query;

    // If no id, return root
    const nodeId = id || 'root';
    const node = fileTree[nodeId];

    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    // If it's a file, just return it
    if (node.type === 'file') {
      return res.json({ node });
    }

    // If it's a folder, return folder + its children
    const children = (node.children || []).map(childId => fileTree[childId]).filter(Boolean);

    return res.json({
      node,
      children,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/files/root
// Returns only the root level folders (for initial load)
export const getRootFiles = (req, res) => {
  try {
    const root = fileTree['root'];
    const children = (root.children || []).map(id => fileTree[id]).filter(Boolean);

    return res.json({
      node: root,
      children,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};