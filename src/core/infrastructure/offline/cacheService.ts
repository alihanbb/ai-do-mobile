// src/core/infrastructure/offline/cacheService.ts
// Local cache service for offline data access

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@cache_';
const CACHE_EXPIRY_KEY = '@cache_expiry_';

interface CacheOptions {
    expiryMinutes?: number;
}

class CacheService {
    /**
     * Store data in cache
     */
    async set<T>(key: string, data: T, options?: CacheOptions): Promise<void> {
        try {
            const cacheKey = CACHE_PREFIX + key;
            await AsyncStorage.setItem(cacheKey, JSON.stringify(data));

            if (options?.expiryMinutes) {
                const expiryTime = Date.now() + options.expiryMinutes * 60 * 1000;
                await AsyncStorage.setItem(CACHE_EXPIRY_KEY + key, expiryTime.toString());
            }
        } catch (error) {
            console.error(`Error caching ${key}:`, error);
        }
    }

    /**
     * Get data from cache
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const cacheKey = CACHE_PREFIX + key;

            // Check expiry
            const expiryStr = await AsyncStorage.getItem(CACHE_EXPIRY_KEY + key);
            if (expiryStr) {
                const expiryTime = parseInt(expiryStr, 10);
                if (Date.now() > expiryTime) {
                    await this.remove(key);
                    return null;
                }
            }

            const data = await AsyncStorage.getItem(cacheKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting cache ${key}:`, error);
            return null;
        }
    }

    /**
     * Remove item from cache
     */
    async remove(key: string): Promise<void> {
        try {
            const cacheKey = CACHE_PREFIX + key;
            await AsyncStorage.multiRemove([cacheKey, CACHE_EXPIRY_KEY + key]);
        } catch (error) {
            console.error(`Error removing cache ${key}:`, error);
        }
    }

    /**
     * Check if key exists and is valid
     */
    async has(key: string): Promise<boolean> {
        const data = await this.get(key);
        return data !== null;
    }

    /**
     * Clear all cached data
     */
    async clear(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(
                (k) => k.startsWith(CACHE_PREFIX) || k.startsWith(CACHE_EXPIRY_KEY)
            );
            await AsyncStorage.multiRemove(cacheKeys);
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    /**
     * Get cached data or fetch from source
     */
    async getOrFetch<T>(
        key: string,
        fetcher: () => Promise<T>,
        options?: CacheOptions
    ): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached !== null) {
            return cached;
        }

        const fresh = await fetcher();
        await this.set(key, fresh, options);
        return fresh;
    }
}

export const cacheService = new CacheService();
