import logger from "./logger.js";

class Cache {
    constructor(ttl = 600) {
        this.cache = new Map();
        this.ttl = ttl * 1000; // default 10 minutes
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            logger.info(`Cache expired for key: ${key}`);
            return null;
        }

        logger.info(`Cache hit for key: ${key}`);
        return item.value;
    }

    set(key, value) {
        const expiry = Date.now() + this.ttl;
        this.cache.set(key, { value, expiry });
        logger.info(`Cache set for key: ${key}`);
    }

    delete(key) {
        this.cache.delete(key);
        logger.info(`Cache deleted for key: ${key}`);
    }

    clear() {
        this.cache.clear();
        logger.info("Cache cleared");
    }
}

export const productCache = new Cache(300); // 5 minutes for products
export const orderCache = new Cache(60); // 1 minute for orders
