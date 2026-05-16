// server/routes/stats.js

import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedStats = null;
let statsPromise = null;

// This function spawns a background thread so Node.js's main event loop isn't blocked 
// by heavy array reduction and tree traversal over millions of objects.
const computeStatsInWorker = () => {
  if (statsPromise) return statsPromise;

  statsPromise = new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, '../workers/statsWorker.js');
    console.log('⚙️ Offloading heavy stats computation to a background Worker Thread...');
    const worker = new Worker(workerPath);

    worker.on('message', (message) => {
      if (message.success) {
        console.log('✅ Background Worker finished computing stats.');
        cachedStats = message.stats;
        resolve(message.stats);
      } else {
        console.error('❌ Worker Error:', message.error);
        reject(new Error(message.error));
      }
    });

    worker.on('error', (err) => {
      console.error('❌ Worker Thread crashed:', err);
      reject(err);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Worker stopped with exit code ${code}`);
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });

  return statsPromise;
};

// Start background computation immediately on server start
// This executes asynchronously, allowing the server to boot instantly.
computeStatsInWorker().catch(console.error);

export const getStats = async (req, res) => {
  try {
    // If already computed, return the cached version instantly O(1)
    if (cachedStats) {
      return res.json(cachedStats);
    }
    
    // If a request comes in while it's still computing, wait for the Promise to resolve
    const stats = await computeStatsInWorker();
    return res.json(stats);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while computing stats' });
  }
};