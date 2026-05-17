// server/index.js

import express from 'express';
import cors from 'cors';
import { getFiles, getRootFiles } from './routes/files.js';
import { searchFiles } from './routes/search.js';
import { getStats } from './routes/stats.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://file-explorer-sakshamkamra33.vercel.app',
    /\.vercel\.app$/,
  ],
  methods: ['GET'],
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'File Explorer API is running 🚀' });
});

// Files
app.get('/api/files', getFiles);
app.get('/api/files/root', getRootFiles);

// Search
app.get('/api/search', searchFiles);

// Stats
app.get('/api/stats', getStats);

// Benchmark
import { runBenchmark } from './routes/benchmark.js';
app.get('/api/benchmark', runBenchmark);

// ─── Error Handling ───────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 File Explorer API ready`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});