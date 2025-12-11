// src/core/infrastructure/storage/SecureStorageAdapter.ts
// Secure storage adapter implementation using expo-secure-store

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { IStorageAdapter } from './IStorageAdapter';

export class SecureStorageAdapter implements IStorageAdapter {
    private webStorage = {
        setItem: (key: string, value: string) => {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(key, value);
            }
        },
        getItem: (key: string): string | null => {
            if (typeof window !== 'undefined' && window.localStorage) {
                return localStorage.getItem(key);
            }
            return null;
        },
        removeItem: (key: string) => {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.removeItem(key);
            }
        },
    };

    private get isWeb(): boolean {
        return Platform.OS === 'web';
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            let data: string | null;
            if (this.isWeb) {
                data = this.webStorage.getItem(key);
            } else {
                data = await SecureStore.getItemAsync(key);
            }
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return null;
        }
    }

    async set<T>(key: string, value: T): Promise<void> {
        try {
            const data = JSON.stringify(value);
            if (this.isWeb) {
                this.webStorage.setItem(key, data);
            } else {
                await SecureStore.setItemAsync(key, data);
            }
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
            throw error;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            if (this.isWeb) {
                this.webStorage.removeItem(key);
            } else {
                await SecureStore.deleteItemAsync(key);
            }
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
        }
    }

    async clear(): Promise<void> {
        // SecureStore doesn't have a clear all method
        // This would need to track all keys stored
        console.warn('Clear all not fully implemented for SecureStore');
    }
}

// Singleton instance
export const secureStorage = new SecureStorageAdapter();
