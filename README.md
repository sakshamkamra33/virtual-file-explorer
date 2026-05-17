# 📱 Virtual File Explorer (100k+ Node Scale)

A high-performance, full-stack Virtual File Explorer designed to handle **100,000+ files and folders** seamlessly in the browser. Built to demonstrate FAANG-level engineering principles, this project prioritizes extreme network optimization, memory safety, and 60FPS rendering.

![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MessagePack](https://img.shields.io/badge/MessagePack-binary-blue?style=for-the-badge)

---

## 🚀 Project Overview

Most standard web applications choke when attempting to load and render thousands of nested elements. This project solves three massive bottlenecks:
1. **Network Transfer:** Fetching a 100k+ JSON hierarchy crushes bandwidth.
2. **Main Thread Blocking:** Parsing massive payloads freezes the browser.
3. **DOM Rendering:** Rendering 100k DOM nodes simultaneously causes out-of-memory browser crashes.

This File Explorer circumvents all three by implementing **Binary Serialization**, **Background Worker Threads**, and **DOM Virtualization**.

---

## ✨ Key Features

*   **⚡ Live Performance Analyzer:** Features an interactive benchmarking dashboard that dynamically races standard JSON serialization against Binary MessagePack serialization in memory, proving a ~49% reduction in payload size.
*   **🖼️ 60FPS Virtualized Rendering:** Integrates `TanStack Virtual` to render only the exact files currently visible in the user's viewport, allowing the UI to handle infinite scrolling of massive directories without lag.
*   **🔍 Instant Search & Lookups:** Utilizes O(1) Hash Map lookups and efficient tree-traversal algorithms to find nested files instantly.
*   **🧹 Multithreaded Storage Cleaning:** The backend offloads heavy statistical calculations (like finding duplicate files and calculating total directory sizes) to Node.js `worker_threads`, completely protecting the main Event Loop.
*   **💎 Premium Glassmorphism UI:** A sleek, fully responsive dark-mode interface built with modern CSS properties, micro-animations, and fluid state management via `Zustand`.

---

## 🏗 Architecture & Engineering Decisions

### 1. Binary Serialization (MessagePack over JSON)
Instead of transferring the file tree as a massive `JSON` object, the backend dynamically compresses the data into a Binary Buffer using `msgpackr`. 
*   **Result:** Network payloads dropped from ~6.5MB down to ~3.3MB (49% reduction). 
*   **Trade-off:** A file explorer is a **Read-Heavy** application. We traded a slightly slower Server Write (compression) time to guarantee Lightning-Fast Network Reads and significantly cheaper cloud egress costs.

### 2. Multi-threading in Node.js
Analyzing 100,000 items to calculate total GB used, find duplicates, and group file extensions is CPU-intensive. Instead of blocking the Express.js single thread (which would freeze all other users from fetching data), the `GET /api/stats` route spawns a dedicated background `Worker Thread` to crunch the math asynchronously.

### 3. Smart Hardware Detection
The Live Benchmark tool automatically detects the current hardware environment. If it detects it is running on a restricted free-tier cloud server (e.g., 512MB RAM), it securely caps dynamic generation limits to prevent V8 Engine `Out of Memory (OOM)` crashes, while allowing unlimited scaling for local executions.

---

## 📂 Folder Structure

```text
file_explorer_project/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Modular UI Components (Dashboard, FileTree, etc.)
│   │   ├── constants/          # Environment & API Configurations
│   │   ├── services/           # Fetch APIs (No heavy Axios dependency)
│   │   ├── store/              # Zustand global state management
│   │   └── index.css           # Premium Glassmorphism & UI tokens
│   └── package.json
│
├── server/                     # Node.js / Express Backend
│   ├── data/                   # Generated .pack binary datasets
│   ├── middleware/             # Global Error Handlers & CORS
│   ├── routes/                 # API endpoints (Files, Stats, Search, Benchmark)
│   ├── scripts/                # Data Generation Algorithms (generateData.js)
│   ├── workers/                # Node.js Worker Threads (statsWorker.js)
│   └── index.js                # Express App Entry
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   Git

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/file_explorer_project.git
cd file_explorer_project
```

### 2. Setup the Backend
```bash
cd server
npm install

# Generate the massive 100k+ file tree binary file
npm run generate:data 

# Start the Node.js server
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd client
npm install

# Start the React Vite server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📊 Performance Benchmark Data

| Metric | Standard `JSON` | Binary `MessagePack` | Improvement |
| :--- | :--- | :--- | :--- |
| **Payload Size** | 6.48 MB | 3.33 MB | **49% Smaller** |
| **Network Egress Cost** | High | Low | **Saved 50%** |
| **Deserialization (Read)** | ~189ms | ~105ms | **44% Faster** |

> *Benchmarks generated via the built-in `/api/benchmark` route on a 50,000 node generated tree.*

---
*Built with ❤️ focusing on low-level performance and modern web design.*