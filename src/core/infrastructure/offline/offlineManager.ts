// src/core/infrastructure/offline/offlineManager.ts
// Offline queue management and sync service

import AsyncStorage from '@react-native-async-storage/async-storage';
import { networkMonitor } from '../network/networkMonitor';

interface QueuedAction {
    id: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: string;
    payload: unknown;
    timestamp: number;
    retryCount: number;
}

const QUEUE_STORAGE_KEY = '@offline_queue';
const MAX_RETRIES = 3;

class OfflineManager {
    private queue: QueuedAction[] = [];
    private isSyncing = false;
    private syncHandlers: Map<string, (action: QueuedAction) => Promise<void>> = new Map();

    /**
     * Initialize the offline manager
     */
    async initialize(): Promise<void> {
        await this.loadQueue();

        // Listen for network changes
        networkMonitor.addListener((isConnected) => {
            if (isConnected) {
                this.processQueue();
            }
        });
    }

    /**
     * Add an action to the offline queue
     */
    async queueAction(
        type: QueuedAction['type'],
        entity: string,
        payload: unknown
    ): Promise<void> {
        const action: QueuedAction = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            entity,
            payload,
            timestamp: Date.now(),
            retryCount: 0,
        };

        this.queue.push(action);
        await this.saveQueue();

        // Try to process immediately if online
        if (networkMonitor.isConnected) {
            this.processQueue();
        }
    }

    /**
     * Register a sync handler for an entity type
     */
    registerSyncHandler(
        entity: string,
        handler: (action: QueuedAction) => Promise<void>
    ): void {
        this.syncHandlers.set(entity, handler);
    }

    /**
     * Process all queued actions
     */
    async processQueue(): Promise<void> {
        if (this.isSyncing || this.queue.length === 0) {
            return;
        }

        if (!networkMonitor.isConnected) {
            console.log('Offline - queue processing paused');
            return;
        }

        this.isSyncing = true;

        const processedIds: string[] = [];
        const failedActions: QueuedAction[] = [];

        for (const action of this.queue) {
            const handler = this.syncHandlers.get(action.entity);

            if (!handler) {
                console.warn(`No sync handler registered for entity: ${action.entity}`);
                failedActions.push(action);
                continue;
            }

            try {
                await handler(action);
                processedIds.push(action.id);
            } catch (error) {
                console.error(`Failed to sync action ${action.id}:`, error);

                if (action.retryCount < MAX_RETRIES) {
                    failedActions.push({
                        ...action,
                        retryCount: action.retryCount + 1,
                    });
                } else {
                    console.error(`Action ${action.id} exceeded max retries, discarding`);
                }
            }
        }

        // Update queue with failed actions only
        this.queue = failedActions;
        await this.saveQueue();

        this.isSyncing = false;

        console.log(`Sync complete: ${processedIds.length} processed, ${failedActions.length} pending`);
    }

    /**
     * Get pending queue count
     */
    get pendingCount(): number {
        return this.queue.length;
    }

    /**
     * Check if there are pending actions
     */
    get hasPendingActions(): boolean {
        return this.queue.length > 0;
    }

    /**
     * Clear all queued actions
     */
    async clearQueue(): Promise<void> {
        this.queue = [];
        await this.saveQueue();
    }

    /**
     * Load queue from storage
     */
    private async loadQueue(): Promise<void> {
        try {
            const data = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
            if (data) {
                this.queue = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading offline queue:', error);
            this.queue = [];
        }
    }

    /**
     * Save queue to storage
     */
    private async saveQueue(): Promise<void> {
        try {
            await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
        } catch (error) {
            console.error('Error saving offline queue:', error);
        }
    }
}

export const offlineManager = new OfflineManager();
