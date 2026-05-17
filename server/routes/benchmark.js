import { Packr } from 'msgpackr';
import { performance } from 'perf_hooks';

const packr = new Packr({ variableMapSize: true });

function generateMockFlatMap(numFiles, maxDepth) {
  const flatMap = {};
  let idCounter = 1;
  const genId = () => `node_${idCounter++}`;

  flatMap['root'] = { id: 'root', name: 'Internal Storage', type: 'folder', parentId: null, children: [] };
  
  const folders = ['root'];
  
  // Create folder hierarchy
  let currentLevel = ['root'];
  for (let d = 0; d < maxDepth; d++) {
    const nextLevel = [];
    for (const parentId of currentLevel) {
      for (let i = 0; i < 2; i++) {
        const newFolderId = genId();
        flatMap[newFolderId] = {
          id: newFolderId, name: `Folder_${d}_${i}`, type: 'folder', parentId: parentId, children: []
        };
        flatMap[parentId].children.push(newFolderId);
        folders.push(newFolderId);
        nextLevel.push(newFolderId);
      }
    }
    currentLevel = nextLevel;
  }

  // Distribute files randomly across all created folders
  for (let i = 0; i < numFiles; i++) {
    const fileId = genId();
    const parentFolder = folders[Math.floor(Math.random() * folders.length)];
    flatMap[fileId] = {
      id: fileId,
      name: `file_${i}.txt`,
      type: 'file',
      extension: 'txt',
      size: Math.floor(Math.random() * 1000000),
      parentId: parentFolder
    };
    flatMap[parentFolder].children.push(fileId);
  }

  return flatMap;
}

export const runBenchmark = (req, res) => {
  try {
    const files = parseInt(req.query.files) || 10000;
    const depth = parseInt(req.query.depth) || 5;

    // Limit to prevent server crash during benchmarks
    if (files > 500000) {
      return res.status(400).json({ error: "Max files for benchmark is 500,000" });
    }
    if (depth > 12) {
      return res.status(400).json({ error: "Max depth is 12" });
    }

    // 1. Generation
    const startGen = performance.now();
    const flatMap = generateMockFlatMap(files, depth);
    const endGen = performance.now();

    // 2. JSON Serialize
    const startJsonStr = performance.now();
    const jsonString = JSON.stringify(flatMap);
    const endJsonStr = performance.now();
    const jsonSizeMB = Buffer.byteLength(jsonString, 'utf8') / (1024 * 1024);

    // 3. Binary Serialize
    const startBinPack = performance.now();
    const binaryBuffer = packr.pack(flatMap);
    const endBinPack = performance.now();
    const binSizeMB = binaryBuffer.length / (1024 * 1024);

    // 4. JSON Deserialize
    const startJsonParse = performance.now();
    JSON.parse(jsonString);
    const endJsonParse = performance.now();

    // 5. Binary Deserialize
    const startBinUnpack = performance.now();
    packr.unpack(binaryBuffer);
    const endBinUnpack = performance.now();

    res.json({
      parameters: { files, depth, totalNodes: Object.keys(flatMap).length },
      generationTimeMs: (endGen - startGen).toFixed(2),
      json: {
        sizeMB: jsonSizeMB.toFixed(2),
        serializeTimeMs: (endJsonStr - startJsonStr).toFixed(2),
        deserializeTimeMs: (endJsonParse - startJsonParse).toFixed(2)
      },
      binary: {
        sizeMB: binSizeMB.toFixed(2),
        serializeTimeMs: (endBinPack - startBinPack).toFixed(2),
        deserializeTimeMs: (endBinUnpack - startBinUnpack).toFixed(2)
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
