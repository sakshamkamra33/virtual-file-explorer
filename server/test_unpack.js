import fs from 'fs';
import { unpack } from 'msgpackr';

const dataPath = 'C:\\Users\\ASUS\\CODING\\PROJECTS\\file_explorer_project\\server\\data\\fileTree.pack';
const fileTree = unpack(fs.readFileSync(dataPath));

console.log('Type of fileTree:', typeof fileTree);
console.log('Is Map?', fileTree instanceof Map);
console.log('Root node:', fileTree['root'] ? 'exists' : 'missing');
