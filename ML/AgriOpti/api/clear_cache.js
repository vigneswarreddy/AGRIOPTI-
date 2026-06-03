import { productCache } from './utils/cache.js';

console.log("Clearing product cache...");
productCache.clear();
console.log("Cache cleared successfully!");
process.exit(0);
