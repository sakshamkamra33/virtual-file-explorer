// server/routes/search.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Packr } from 'msgpackr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packr = new Packr({ variableMapSize: true });
const dataPath = path.resolve(__dirname, '../data/fileTree.pack');
const fileTree = packr.unpack(fs.readFileSync(dataPath));

// FAANG-Level Implementation: Prefix Trie for O(L) Search Complexity
class TrieNode {
  constructor() {
    this.children = {};
    this.fileIds = new Set();
  }
}

class SearchTrie {
  constructor() {
    this.root = new TrieNode();
  }

  // Tokenize a string into alphanumeric parts (e.g., "resume_2024.pdf" -> ["resume", "2024", "pdf"])
  tokenize(text) {
    return text.toLowerCase().split(/[^a-z0-9]/).filter(t => t.length > 0);
  }

  insert(fileId, filename) {
    const tokens = this.tokenize(filename);
    for (const token of tokens) {
      let current = this.root;
      // Add the file ID to every prefix node to enable instant partial-match retrieval
      for (let i = 0; i < token.length; i++) {
        const char = token[i];
        if (!current.children[char]) {
          current.children[char] = new TrieNode();
        }
        current = current.children[char];
        current.fileIds.add(fileId);
      }
    }
  }

  searchPrefix(prefix) {
    let current = this.root;
    for (const char of prefix) {
      if (!current.children[char]) return new Set(); // Prefix not found
      current = current.children[char];
    }
    return current.fileIds;
  }

  search(query) {
    const tokens = this.tokenize(query);
    if (tokens.length === 0) return new Set();

    // Start with the set of IDs matching the first token
    let resultIds = this.searchPrefix(tokens[0]);

    // If there are multiple words in the query, intersect the sets to find documents containing ALL tokens
    for (let i = 1; i < tokens.length; i++) {
      const nextIds = this.searchPrefix(tokens[i]);
      resultIds = new Set([...resultIds].filter(id => nextIds.has(id)));
    }

    return resultIds;
  }
}

// Build the Trie once at startup
console.log('🌳 Building Search Trie...');
const searchTrie = new SearchTrie();
Object.values(fileTree).forEach(node => {
  searchTrie.insert(node.id, node.name);
});
console.log('✅ Search Trie built successfully! Ready for O(1) lookups.');

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

    // 1. O(L) lookup for matching IDs using the Trie (L = length of query)
    const matchingIds = searchTrie.search(query);

    // 2. Map IDs back to file objects and apply type filtering
    let results = [];
    for (const id of matchingIds) {
      const node = fileTree[id];
      if (!type || node.extension === type) {
        results.push(node);
      }
    }

    // 3. Sort — exact matches first, then alphabetical
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === query;
      const bExact = b.name.toLowerCase() === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.name.localeCompare(b.name);
    });

    // 4. Limit results
    results = results.slice(0, parseInt(limit));

    return res.json({
      query: q,
      total: matchingIds.size, // Returns the true total matching before limit/type
      results,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};