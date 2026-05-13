// client/src/components/UI/Icon.jsx

import { getFileType, getCategoryIcon } from '../../utils/fileTypeMap.js';

const Icon = ({ node, size = 16 }) => {
  if (node.type === 'folder') {
    return (
      <span style={{ fontSize: size }}>📁</span>
    );
  }

  const fileType = getFileType(node.extension);
  const icon = getCategoryIcon(fileType.category);

  return (
    <span style={{ fontSize: size }}>{icon}</span>
  );
};

export default Icon;