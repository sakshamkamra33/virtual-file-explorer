import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parentPort } from 'worker_threads';
import { Packr } from 'msgpackr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const packr = new Packr({ variableMapSize: true });
  const dataPath = path.resolve(__dirname, '../data/fileTree.pack');
  const fileTree = packr.unpack(fs.readFileSync(dataPath));

  const allNodes = Object.values(fileTree);
  const files = allNodes.filter(n => n.type === 'file');
  const folders = allNodes.filter(n => n.type === 'folder');

  const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);

  // Category breakdown
  const categoryMap = {
    Images:    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
    Videos:    ['mp4', 'mkv', 'avi', 'mov', 'wmv'],
    Audio:     ['mp3', 'wav', 'flac', 'ogg', 'opus', 'm3u'],
    Documents: ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'epub'],
    Apps:      ['apk', 'obb'],
    Archives:  ['zip', 'rar', 'torrent'],
    System:    ['db', 'log', 'tmp', 'cache', 'exo'],
  };

  const categoryColors = {
    Images:    '#4CAF50',
    Videos:    '#2196F3',
    Audio:     '#9C27B0',
    Documents: '#F44336',
    Apps:      '#FF9800',
    Archives:  '#795548',
    System:    '#607D8B',
  };

  const categoryStats = {};
  Object.keys(categoryMap).forEach(cat => {
    categoryStats[cat] = { count: 0, size: 0, color: categoryColors[cat] };
  });
  categoryStats['Others'] = { count: 0, size: 0, color: '#9E9E9E' };

  files.forEach(f => {
    const ext = f.extension || '';
    let matched = false;
    for (const [cat, exts] of Object.entries(categoryMap)) {
      if (exts.includes(ext)) {
        categoryStats[cat].count++;
        categoryStats[cat].size += f.size || 0;
        matched = true;
        break;
      }
    }
    if (!matched) {
      categoryStats['Others'].count++;
      categoryStats['Others'].size += f.size || 0;
    }
  });

  // Top 5 largest files
  const largestFiles = [...files]
    .sort((a, b) => b.size - a.size)
    .slice(0, 5)
    .map(f => ({ name: f.name, size: f.size, path: f.path, extension: f.extension }));

  // Top 5 largest folders
  const getFolderSize = (folderId) => {
    const folder = fileTree[folderId];
    if (!folder || !folder.children) return 0;
    return folder.children.reduce((sum, childId) => {
      const child = fileTree[childId];
      if (!child) return sum;
      if (child.type === 'file') return sum + (child.size || 0);
      return sum + getFolderSize(childId);
    }, 0);
  };

  const rootFolders = fileTree['root']?.children || [];
  const largestFolders = rootFolders
    .map(id => ({
      name: fileTree[id]?.name,
      size: getFolderSize(id),
      id,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

  // Extension breakdown top 10
  const extBreakdown = {};
  files.forEach(f => {
    const ext = f.extension || 'unknown';
    if (!extBreakdown[ext]) extBreakdown[ext] = { count: 0, size: 0 };
    extBreakdown[ext].count++;
    extBreakdown[ext].size += f.size || 0;
  });

  const topExtensions = Object.entries(extBreakdown)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([ext, data]) => ({ ext, ...data }));

  // Storage simulation (512GB phone to accommodate 100k files)
  const TOTAL_STORAGE = 512 * 1024 * 1024 * 1024;
  const usedPercent = ((totalSize / TOTAL_STORAGE) * 100).toFixed(1);

  const stats = {
    totalFiles: files.length,
    totalFolders: folders.length,
    totalNodes: allNodes.length,
    totalSize,
    totalStorage: TOTAL_STORAGE,
    usedPercent: parseFloat(usedPercent),
    categoryStats,
    largestFiles,
    largestFolders,
    topExtensions,
  };

  // Send the computed payload back to the main thread
  parentPort.postMessage({ success: true, stats });

} catch (error) {
  parentPort.postMessage({ success: false, error: error.message });
}
