// src/core/infrastructure/storage/AsyncStorageAdapter.ts
// Async storage adapter for general data persistence

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorageAdapter } from './IStorageAdapter';

export class AsyncStorageAdapter implements IStorageAdapter {
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await AsyncStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return null;
        }
    }

    async set<T>(key: string, value: T): Promise<void> {
        try {
            const data = JSON.stringify(value);
            await AsyncStorage.setItem(key, data);
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
            throw error;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
        }
    }

    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
}

// Singleton instance
export const asyncStorage = new AsyncStorageAdapter();
