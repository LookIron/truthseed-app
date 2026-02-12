import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface VerseCacheDB extends DBSchema {
  verses: {
    key: string;
    value: {
      text: string;
      timestamp: number;
    };
  };
}

const DB_NAME = 'truthseed-cache';
const DB_VERSION = 1;
const STORE_NAME = 'verses';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * IndexedDB-based cache for Bible verses
 * Implements stale-while-revalidate strategy
 */
export class IndexedDBCache {
  private db: IDBPDatabase<VerseCacheDB> | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize the database connection
   */
  private async init(): Promise<void> {
    if (this.db) return;

    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = (async () => {
      this.db = await openDB<VerseCacheDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });
    })();

    await this.initPromise;
  }

  /**
   * Get a verse from cache
   * @param key Cache key (e.g., "RVR60:Juan:1:12")
   * @returns Cached verse text or null if not found/expired
   */
  async get(key: string): Promise<string | null> {
    try {
      await this.init();
      if (!this.db) return null;

      const entry = await this.db.get(STORE_NAME, key);
      if (!entry) return null;

      // Check if cache is stale
      const age = Date.now() - entry.timestamp;
      if (age > CACHE_DURATION) {
        // Cache is stale, delete it
        await this.delete(key);
        return null;
      }

      return entry.text;
    } catch (error) {
      console.error('IndexedDBCache get error:', error);
      return null;
    }
  }

  /**
   * Set a verse in cache
   * @param key Cache key
   * @param text Verse text to cache
   */
  async set(key: string, text: string): Promise<void> {
    try {
      await this.init();
      if (!this.db) return;

      await this.db.put(
        STORE_NAME,
        {
          text,
          timestamp: Date.now(),
        },
        key
      );
    } catch (error) {
      console.error('IndexedDBCache set error:', error);
    }
  }

  /**
   * Delete a verse from cache
   * @param key Cache key
   */
  async delete(key: string): Promise<void> {
    try {
      await this.init();
      if (!this.db) return;

      await this.db.delete(STORE_NAME, key);
    } catch (error) {
      console.error('IndexedDBCache delete error:', error);
    }
  }

  /**
   * Clear all cached verses
   */
  async clear(): Promise<void> {
    try {
      await this.init();
      if (!this.db) return;

      await this.db.clear(STORE_NAME);
    } catch (error) {
      console.error('IndexedDBCache clear error:', error);
    }
  }

  /**
   * Check if cache is supported in this environment
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }
}

// Export singleton instance
export const verseCache = new IndexedDBCache();
