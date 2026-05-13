// client/src/utils/fileTypeMap.js

export const fileTypeMap = {
  // Images
  jpg: { category: 'image', color: '#4CAF50', label: 'JPEG Image' },
  jpeg: { category: 'image', color: '#4CAF50', label: 'JPEG Image' },
  png: { category: 'image', color: '#4CAF50', label: 'PNG Image' },
  gif: { category: 'image', color: '#4CAF50', label: 'GIF Image' },
  webp: { category: 'image', color: '#4CAF50', label: 'WebP Image' },
  bmp: { category: 'image', color: '#4CAF50', label: 'Bitmap Image' },

  // Videos
  mp4: { category: 'video', color: '#2196F3', label: 'MP4 Video' },
  mkv: { category: 'video', color: '#2196F3', label: 'MKV Video' },
  avi: { category: 'video', color: '#2196F3', label: 'AVI Video' },
  mov: { category: 'video', color: '#2196F3', label: 'MOV Video' },

  // Audio
  mp3: { category: 'audio', color: '#9C27B0', label: 'MP3 Audio' },
  wav: { category: 'audio', color: '#9C27B0', label: 'WAV Audio' },
  flac: { category: 'audio', color: '#9C27B0', label: 'FLAC Audio' },
  ogg: { category: 'audio', color: '#9C27B0', label: 'OGG Audio' },
  opus: { category: 'audio', color: '#9C27B0', label: 'Opus Audio' },
  m3u: { category: 'audio', color: '#9C27B0', label: 'Playlist' },

  // Documents
  pdf: { category: 'document', color: '#F44336', label: 'PDF Document' },
  docx: { category: 'document', color: '#1565C0', label: 'Word Document' },
  doc: { category: 'document', color: '#1565C0', label: 'Word Document' },
  xlsx: { category: 'document', color: '#2E7D32', label: 'Excel Sheet' },
  xls: { category: 'document', color: '#2E7D32', label: 'Excel Sheet' },
  pptx: { category: 'document', color: '#E65100', label: 'PowerPoint' },
  txt: { category: 'document', color: '#607D8B', label: 'Text File' },
  epub: { category: 'document', color: '#607D8B', label: 'E-Book' },

  // Apps
  apk: { category: 'app', color: '#FF9800', label: 'Android App' },
  obb: { category: 'app', color: '#FF9800', label: 'App Data' },

  // Archives
  zip: { category: 'archive', color: '#795548', label: 'ZIP Archive' },
  rar: { category: 'archive', color: '#795548', label: 'RAR Archive' },
  torrent: { category: 'archive', color: '#795548', label: 'Torrent' },

  // System/Cache
  db: { category: 'system', color: '#607D8B', label: 'Database' },
  log: { category: 'system', color: '#607D8B', label: 'Log File' },
  tmp: { category: 'system', color: '#9E9E9E', label: 'Temp File' },
  cache: { category: 'system', color: '#9E9E9E', label: 'Cache File' },
  exo: { category: 'system', color: '#9E9E9E', label: 'Cache File' },
};

export const getFileType = (extension) => {
  return fileTypeMap[extension?.toLowerCase()] || {
    category: 'unknown',
    color: '#9E9E9E',
    label: 'Unknown File',
  };
};

export const getCategoryIcon = (category) => {
  const icons = {
    image: '🖼️',
    video: '🎬',
    audio: '🎵',
    document: '📄',
    app: '📦',
    archive: '🗜️',
    system: '⚙️',
    unknown: '📄',
    folder: '📁',
  };
  return icons[category] || '📄';
};