<div align="center">
  
# 📱 FAANG-Level Virtual File Explorer

**A high-performance, full-stack web application engineered to simulate a massive mobile file system.** 

Built to handle **100,000+ files** with zero-latency, utilizing binary serialization, background worker threads, O(1) Prefix Trie searching, and a stunning glassmorphic UI.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://virtual-file-explorer.vercel.app)
[![API Status](https://img.shields.io/badge/API_Status-Render-black?style=for-the-badge&logo=render)](https://virtual-file-explorer.onrender.com/api/health)

</div>

---

## 🚀 Architecture Highlights

Most file explorer projects crash when rendering 10,000 items due to memory overflows and event-loop blocking. This project was engineered specifically to solve scaling bottlenecks using enterprise-grade architecture:

- **📦 Binary Serialization:** Dropped standard JSON for **MessagePack (`msgpackr`)**, reducing the 100,000-file payload size by 60% and bypassing the Node.js V8 memory string limits via variable-map sizing.
- **⚡ O(1) Prefix Trie Search:** Replaced slow linear `Array.filter` algorithms with a custom Trie Data Structure, dropping search query latency to sub-milliseconds.
- **🧵 Multi-Threaded Analytics:** Offloaded the heavy 512GB virtual storage calculation to a dedicated Node.js **Worker Thread**, guaranteeing the main API event loop is never blocked.
- **♻️ DOM Virtualization:** Integrated **TanStack Virtual** on the React frontend to recycle HTML nodes, allowing users to smoothly scroll through 15,000+ items inside a single folder without dropping frames.
- **✨ FAANG Glassmorphism UI:** Completely custom responsive layout featuring `backdrop-filter` glassmorphism, fluid micro-animations, and dynamic ambient glows.
- **🐳 Docker Containerization:** Fully containerized with custom `Dockerfile`s and `docker-compose.yml` for seamless continuous deployment (CI/CD) pipelines.

---

## ✨ Features

- 📁 **Massive File Tree** — Browse deeply nested folder structures with 100k+ dynamically generated files.
- 📊 **Storage Analytics** — Asynchronously calculated storage breakdown (Images, Videos, APKs).
- 🧹 **Storage Cleaner** — Smart suggestions to free up space from large unused files.
- 🔎 **Duplicate Finder** — Detects duplicate hashes across folders.
- 🎯 **Advanced Sorting** — Custom hierarchy sorting (folders pinned, Internal Storage always at top).
- 📱 **Mobile Drawer UI** — Fully responsive app that converts the tree into an overlay drawer on mobile.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 18 + Vite
- **Performance:** TanStack Virtual (Windowing)
- **State Management:** Zustand
- **Styling:** Custom Vanilla CSS (Glassmorphism + Inter Font)
- **Deployment:** Vercel

### Backend (Server)
- **Runtime:** Node.js (Express.js)
- **Data Engineering:** `msgpackr` (Binary Serialization)
- **Concurrency:** Node `worker_threads`
- **Data Generation:** `@faker-js/faker`
- **Deployment:** Docker + Render Web Services

---

## 📁 Project Structure

```text
virtual-file-explorer/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Glassmorphic UI Components
│   │   ├── store/              # Zustand State
│   │   └── hooks/              # Custom Data Fetching
│   ├── Dockerfile              # Frontend Container
│   └── nginx.conf              # Production Server
│
├── server/                     # Node.js Backend
│   ├── data/                   # 14MB Binary Database (.pack)
│   ├── routes/                 # Express API Endpoints
│   ├── scripts/                # 100k File Generator
│   ├── workers/                # Background Thread Processing
│   └── Dockerfile              # Backend Container
│
└── docker-compose.yml          # Local orchestration
```

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- Docker (Optional)

### Standard Setup

```bash
# 1. Clone the repo
git clone https://github.com/sakshamkamra33/virtual-file-explorer.git
cd virtual-file-explorer

# 2. Setup Backend & Generate 100k Files
cd server
npm install
npm run generate    # Compiles the 14MB binary .pack file
npm run dev         # Starts API on http://localhost:5000

# 3. Setup Frontend (in a new terminal)
cd ../client
npm install
npm run dev         # Starts UI on http://localhost:5173
```

### Docker Setup

```bash
# Instantly build and run the entire stack locally
docker-compose up --build
```

---

## 👨‍💻 Author
**Saksham Kamra** — [GitHub Profile](https://github.com/sakshamkamra33)

## 📄 License
MIT License