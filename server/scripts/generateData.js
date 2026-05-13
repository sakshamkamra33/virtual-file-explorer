// server/scripts/generateData.js
// Run with: npm run generate

import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const flatMap = {};
let idCounter = 1;

const genId = () => `node_${idCounter++}`;

const PHONE_BLUEPRINT = {
  "DCIM": {
    "Camera": { files: 1200, exts: ["jpg", "jpg", "jpg", "jpg", "mp4"] },
    "Screenshots": { files: 600, exts: ["png"] },
    "Edited": { files: 200, exts: ["jpg", "png"] },
    "Burst": { files: 500, exts: ["jpg"] },
    "Slow_Motion": { files: 50, exts: ["mp4"] },
  },
  "Android": {
    "data": {
      "com.whatsapp": {
        "files": { files: 30, exts: ["db", "log"] },
        "Media": {
          "WhatsApp Images": { files: 900, exts: ["jpg"] },
          "WhatsApp Video": { files: 200, exts: ["mp4"] },
          "WhatsApp Documents": { files: 100, exts: ["pdf", "docx"] },
          "WhatsApp Audio": { files: 150, exts: ["mp3", "opus"] },
          "WhatsApp Stickers": { files: 200, exts: ["png", "webp"] },
        }
      },
      "com.instagram.android": {
        "cache": { files: 300, exts: ["jpg", "tmp"] },
        "files": { files: 50, exts: ["db", "log"] },
      },
      "com.spotify.music": {
        "cache": { files: 400, exts: ["cache", "tmp"] },
        "files": { files: 60, exts: ["db"] },
      },
      "com.google.android.youtube": {
        "cache": { files: 300, exts: ["exo", "tmp"] },
        "files": { files: 40, exts: ["db", "log"] },
      },
      "com.snapchat.android": {
        "cache": { files: 250, exts: ["jpg", "tmp"] },
        "files": { files: 30, exts: ["db"] },
      },
      "com.facebook.katana": {
        "cache": { files: 200, exts: ["jpg", "tmp"] },
        "fb_temp": { files: 100, exts: ["tmp", "cache"] },
      },
      "com.netflix.mediaclient": {
        "cache": { files: 100, exts: ["tmp", "exo"] },
        "files": { files: 30, exts: ["db"] },
      },
      "com.google.android.gm": {
        "cache": { files: 120, exts: ["tmp", "cache"] },
        "files": { files: 20, exts: ["db"] },
      },
    },
    "obb": {
      "com.pubg.mobile": { files: 8, exts: ["obb"] },
      "com.garena.freefire": { files: 6, exts: ["obb"] },
      "com.mojang.minecraftpe": { files: 5, exts: ["obb"] },
      "com.activision.callofduty": { files: 7, exts: ["obb"] },
    }
  },
  "Download": {
    "": { files: 400, exts: ["pdf", "zip", "apk", "docx", "xlsx", "mp4", "jpg"] },
    "Compressed": { files: 80, exts: ["zip", "rar"] },
    "Torrents": { files: 50, exts: ["torrent"] },
    "Installers": { files: 60, exts: ["apk"] },
    "E-Books": { files: 70, exts: ["pdf"] },
  },
  "Music": {
    "": { files: 200, exts: ["mp3", "flac", "wav"] },
    "Playlists": { files: 30, exts: ["m3u"] },
    "Podcasts": { files: 100, exts: ["mp3"] },
    "Albums": {
      "Bollywood": { files: 80, exts: ["mp3"] },
      "English": { files: 80, exts: ["mp3", "flac"] },
      "Punjabi": { files: 60, exts: ["mp3"] },
      "Lo-fi": { files: 50, exts: ["mp3", "wav"] },
    },
  },
  "Documents": {
    "": { files: 100, exts: ["pdf", "docx", "txt", "xlsx", "pptx"] },
    "Work": { files: 120, exts: ["pdf", "docx", "xlsx"] },
    "College": { files: 150, exts: ["pdf", "pptx", "docx"] },
    "Personal": { files: 80, exts: ["txt", "pdf"] },
    "Scanned": { files: 60, exts: ["pdf", "jpg"] },
    "Certificates": { files: 30, exts: ["pdf", "jpg"] },
  },
  "Pictures": {
    "Wallpapers": { files: 100, exts: ["jpg", "png"] },
    "Memes": { files: 1000, exts: ["jpg", "png", "gif"] },
    "Saved": { files: 500, exts: ["jpg", "png", "webp"] },
    "Stickers": { files: 150, exts: ["png", "webp"] },
    "Travel": { files: 200, exts: ["jpg", "png"] },
  },
"Movies": {
  "": { files: 15, exts: ["mp4", "mkv"] },
  "Series": { files: 30, exts: ["mp4", "mkv"] },
  "Cartoons": { files: 20, exts: ["mp4"] },
},
  "Ringtones": {
    "": { files: 40, exts: ["mp3", "ogg"] },
    "Custom": { files: 20, exts: ["mp3"] },
  },
  "Bluetooth": {
    "Received": { files: 60, exts: ["jpg", "pdf", "mp3"] },
  },
  "cache": {
    "thumbnails": { files: 1200, exts: ["jpg", "png"] },
    "temp": { files: 800, exts: ["tmp", "cache"] },
    "webview": { files: 300, exts: ["cache", "tmp"] },
    "image_cache": { files: 700, exts: ["jpg", "cache"] },
  },
  "Recordings": {
    "": { files: 80, exts: ["mp3", "wav"] },
    "Calls": { files: 150, exts: ["mp3"] },
    "Voice_Notes": { files: 100, exts: ["opus", "mp3"] },
  },
};

// Real world common filenames
const REAL_WORLD_NAMES = {
  pdf: [
    'resume', 'cv', 'invoice', 'receipt', 'admit_card', 'marksheet',
    'aadhar_card', 'pan_card', 'offer_letter', 'salary_slip', 'bank_statement',
    'notes', 'assignment', 'project_report', 'certificate', 'id_proof',
    'driving_license', 'passport_copy', 'fee_receipt', 'bonafide',
  ],
  docx: [
    'resume', 'cover_letter', 'assignment', 'project_report', 'notes',
    'letter', 'application', 'internship_report', 'thesis', 'proposal',
  ],
  xlsx: [
    'budget', 'expenses', 'marks_sheet', 'attendance', 'salary',
    'accounts', 'timetable', 'tracker', 'data_sheet',
  ],
  pptx: [
    'presentation', 'project_ppt', 'seminar', 'college_project',
    'internship_ppt', 'introduction', 'proposal',
  ],
  txt: [
    'notes', 'todo', 'passwords', 'ideas', 'diary',
    'readme', 'links', 'reminders',
  ],
  mp3: [
    'Tum_Hi_Ho', 'Kesariya', 'Believer', 'Shape_of_You', 'Blinding_Lights',
    'Apna_Bana_Le', 'Raataan_Lambiyan', 'Dynamite', 'Levitating', 'Stay',
    'Dil_Chahta_Hai', 'Chaiyya_Chaiyya', 'Jai_Ho', 'Lucky_Ali',
  ],
  apk: [
    'whatsapp', 'instagram', 'snapchat', 'telegram', 'youtube',
    'netflix', 'spotify', 'pubg', 'freefire', 'minecraft',
    'phonepe', 'paytm', 'gpay', 'amazon', 'flipkart',
  ],
};

function genFileName(ext) {
  // 40% chance of using a real world name
  const useRealName = Math.random() < 0.4;

  if (useRealName && REAL_WORLD_NAMES[ext]) {
    const names = REAL_WORLD_NAMES[ext];
    const base = names[Math.floor(Math.random() * names.length)];
    const suffix = faker.number.int({ min: 1, max: 99 });
    const name = Math.random() < 0.5 ? `${base}_${suffix}` : base;
    return `${name}.${ext}`;
  }

  const generators = {
    jpg: () => `IMG_${faker.date.recent({ days: 365 }).toISOString().slice(0,10).replace(/-/g,'')}_${faker.number.int({min:1000,max:9999})}.jpg`,
    png: () => `Screenshot_${faker.date.recent({ days: 365 }).toISOString().slice(0,10).replace(/-/g,'')}_${faker.number.int({min:10000,max:99999})}.png`,
    mp4: () => `VID_${faker.date.recent({ days: 365 }).toISOString().slice(0,10).replace(/-/g,'')}_${faker.number.int({min:1000,max:9999})}.mp4`,
    mp3: () => `${faker.music.songName().replace(/\s/g,'_')}.mp3`,
    pdf: () => `${faker.lorem.words(2).replace(/\s/g,'_')}.pdf`,
    docx: () => `${faker.lorem.words(2).replace(/\s/g,'_')}.docx`,
    xlsx: () => `${faker.lorem.word()}_sheet.xlsx`,
    pptx: () => `${faker.lorem.words(2).replace(/\s/g,'_')}.pptx`,
    apk: () => `${faker.internet.domainWord()}_v${faker.system.semver()}.apk`,
    zip: () => `${faker.lorem.word()}_archive.zip`,
    rar: () => `${faker.lorem.word()}_backup.rar`,
    txt: () => `${faker.lorem.words(2).replace(/\s/g,'_')}.txt`,
    db:  () => `${faker.lorem.word()}.db`,
    log: () => `log_${faker.date.recent({ days: 30 }).toISOString().slice(0,10)}.log`,
    tmp: () => `tmp_${faker.string.alphanumeric(8)}.tmp`,
    mkv: () => `${faker.lorem.words(3).replace(/\s/g,'.')}.mkv`,
    opus: () => `audio_${faker.string.alphanumeric(6)}.opus`,
    flac: () => `${faker.music.songName().replace(/\s/g,'_')}.flac`,
    wav:  () => `${faker.music.songName().replace(/\s/g,'_')}.wav`,
    gif:  () => `gif_${faker.string.alphanumeric(6)}.gif`,
    webp: () => `img_${faker.string.alphanumeric(6)}.webp`,
    obb:  () => `main.${faker.number.int({min:1,max:9})}.${faker.internet.domainWord()}.obb`,
    cache:() => `cache_${faker.string.alphanumeric(10)}.cache`,
    exo:  () => `${faker.string.alphanumeric(12)}.exo`,
    m3u:  () => `${faker.lorem.word()}_playlist.m3u`,
    ogg:  () => `${faker.music.songName().replace(/\s/g,'_')}.ogg`,
    torrent: () => `${faker.lorem.words(2).replace(/\s/g,'.')}.torrent`,
    epub: () => `${faker.lorem.words(3).replace(/\s/g,'_')}.epub`,
  };
  return generators[ext] ? generators[ext]() : `${faker.lorem.word()}.${ext}`;
}

function genFileSize(ext) {
  const ranges = {
    jpg:     [100_000,   3_000_000],
    png:     [50_000,    1_500_000],
    mp4:     [3_000_000, 40_000_000],
    mkv:     [10_000_000, 80_000_000],
    mp3:     [2_000_000,  8_000_000],
    flac:    [8_000_000,  30_000_000],
    wav:     [5_000_000,  20_000_000],
    pdf:     [50_000,    1_500_000],
    docx:    [20_000,    400_000],
    xlsx:    [20_000,    400_000],
    pptx:    [100_000,   3_000_000],
    txt:     [1_000,     50_000],
    apk:     [5_000_000, 60_000_000],
    obb:     [10_000_000, 50_000_000],
    zip:     [500_000,   30_000_000],
    rar:     [500_000,   30_000_000],
    db:      [5_000,     200_000],
    log:     [1_000,     100_000],
    tmp:     [1_000,     50_000],
    cache:   [1_000,     30_000],
    exo:     [1_000,     50_000],
    gif:     [100_000,   2_000_000],
    webp:    [50_000,    1_000_000],
    opus:    [500_000,   3_000_000],
    ogg:     [500_000,   3_000_000],
    m3u:     [1_000,     10_000],
    torrent: [10_000,    100_000],
    epub:    [500_000,   5_000_000],
  };
  const [min, max] = ranges[ext] || [1_000, 500_000];
  return faker.number.int({ min, max });
}

function createFile(parentId, ext, folderPath) {
  const id = genId();
  const name = genFileName(ext);
  flatMap[id] = {
    id,
    name,
    type: 'file',
    extension: ext,
    size: genFileSize(ext),
    lastModified: faker.date.recent({ days: 730 }).toISOString(),
    parentId,
    path: `${folderPath}/${name}`,
  };
  return id;
}

function createFolder(name, parentId, currentPath, blueprint) {
  const id = genId();
  const folderPath = `${currentPath}/${name}`;
  const childIds = [];

  flatMap[id] = {
    id,
    name,
    type: 'folder',
    parentId,
    path: folderPath,
    lastModified: faker.date.recent({ days: 365 }).toISOString(),
    children: null,
  };

  for (const [key, value] of Object.entries(blueprint)) {
    if (key === '') {
      for (let i = 0; i < value.files; i++) {
        const ext = value.exts[Math.floor(Math.random() * value.exts.length)];
        childIds.push(createFile(id, ext, folderPath));
      }
    } else if (value.files !== undefined) {
      const subId = genId();
      const subPath = `${folderPath}/${key}`;
      const subChildIds = [];

      flatMap[subId] = {
        id: subId,
        name: key,
        type: 'folder',
        parentId: id,
        path: subPath,
        lastModified: faker.date.recent({ days: 365 }).toISOString(),
        children: null,
      };

      for (let i = 0; i < value.files; i++) {
        const ext = value.exts[Math.floor(Math.random() * value.exts.length)];
        subChildIds.push(createFile(subId, ext, subPath));
      }

      flatMap[subId].children = subChildIds;
      childIds.push(subId);
    } else {
      const nestedId = createFolder(key, id, folderPath, value);
      childIds.push(nestedId);
    }
  }

  flatMap[id].children = childIds;
  return id;
}

// Build root
const rootId = 'root';
flatMap[rootId] = {
  id: rootId,
  name: 'Internal Storage',
  type: 'folder',
  parentId: null,
  path: '/',
  lastModified: new Date().toISOString(),
  children: [],
};

const rootChildren = [];
for (const [folderName, blueprint] of Object.entries(PHONE_BLUEPRINT)) {
  const folderId = createFolder(folderName, rootId, '', blueprint);
  rootChildren.push(folderId);
}
flatMap[rootId].children = rootChildren;

// Save output
const totalNodes = Object.keys(flatMap).length;
// Create data directory if it doesn't exist
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const outPath = path.resolve(dataDir, 'fileTree.json');
fs.writeFileSync(outPath, JSON.stringify(flatMap, null, 2));

console.log(`✅ Done! Generated ${totalNodes} nodes`);
console.log(`📁 Saved to: server/data/fileTree.json`);