# 📱 Mobile File Explorer

A full-stack web application that simulates a mobile phone file system explorer with 10,000+ files, built with React and Node.js.

## 🚀 Live Demo
- **Frontend:** [Coming Soon]
- **Backend API:** [Coming Soon]

## ✨ Features

- 📁 **Recursive File Tree** — Browse deeply nested folder structures like a real phone
- ⚡ **Virtual Scrolling** — Renders 10,000+ files smoothly using TanStack Virtual
- 🔄 **Lazy Loading** — Loads folder contents on demand, not all at once
- 🔍 **Smart Search** — Real-time search across 10,000+ files with debouncing
- 📊 **Storage Analytics** — Visual dashboard showing storage breakdown by category
- 🧹 **Storage Cleaner** — Smart suggestions to free up space
- 🔎 **Duplicate Finder** — Detects duplicate files across folders
- 🎯 **File Type Filter** — Filter by Images, Videos, Audio, Documents, Apps
- ↕️ **Sort Options** — Sort by name, size, or date modified
- 🌙 **Dark/Light Theme** — Toggle between dark and light mode
- 📄 **File Details Panel** — View file metadata on click

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React + Vite | UI Framework |
| Zustand | State Management |
| TanStack Virtual | Virtual Scrolling |
| Fuse.js | Fuzzy Search |
| Axios | HTTP Client |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js | Runtime |
| Express | REST API |
| Faker.js | Fake Data Generation |
| CORS | Cross Origin Support |

## 📁 Project Structure

file_explorer_project/
├── client/                 # React Frontend
│   └── src/
│       ├── components/     # UI Components
│       ├── store/          # Zustand State
│       ├── hooks/          # Custom Hooks
│       ├── services/       # API Calls
│       └── utils/          # Helper Functions
│
└── server/                 # Node.js Backend
├── routes/             # API Routes
├── middleware/         # Error Handler
├── scripts/            # Data Generator
└── data/               # Generated JSON

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Server health check |
| GET | /api/files/root | Get root folders |
| GET | /api/files?id= | Get folder contents |
| GET | /api/search?q= | Search files |
| GET | /api/stats | Storage statistics |

## ⚡ Performance

- **10,000+ nodes** in the file tree
- **Virtual scrolling** — only ~20 DOM nodes rendered at once
- **Lazy loading** — children fetched only when folder opens
- **Debounced search** — 300ms delay prevents excessive API calls
- **Pre-computed stats** — analytics computed once at server startup

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/file-explorer.git
cd file-explorer

# Setup Backend
cd server
npm install
npm run generate    # generates 10,000+ fake files
npm run dev         # starts on http://localhost:5000

# Setup Frontend (new terminal)
cd client
npm install
npm run dev         # starts on http://localhost:5173
```

## 👨‍💻 Author
Your Name — [GitHub](https://github.com/yourusername)

## 📄 License
MIT