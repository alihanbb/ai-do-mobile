// src/core/infrastructure/network/networkMonitor.ts
// Network connectivity monitoring service

import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';
import { create } from 'zustand';

interface NetworkState {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    connectionType: string | null;

    // Actions
    setNetworkState: (state: Partial<NetworkState>) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
    isConnected: true,
    isInternetReachable: true,
    connectionType: null,

    setNetworkState: (state) => set(state),
}));

class NetworkMonitor {
    private subscription: NetInfoSubscription | null = null;
    private listeners: Set<(isConnected: boolean) => void> = new Set();

    /**
     * Start monitoring network connectivity
     */
    start(): void {
        if (this.subscription) {
            return; // Already monitoring
        }

        this.subscription = NetInfo.addEventListener((state: NetInfoState) => {
            const isConnected = state.isConnected ?? false;
            const isInternetReachable = state.isInternetReachable;
            const connectionType = state.type;

            // Update store
            useNetworkStore.getState().setNetworkState({
                isConnected,
                isInternetReachable,
                connectionType,
            });

            // Notify listeners
            this.listeners.forEach((listener) => listener(isConnected));
        });

        // Initial fetch
        this.checkConnection();
    }

    /**
     * Stop monitoring network connectivity
     */
    stop(): void {
        if (this.subscription) {
            this.subscription();
            this.subscription = null;
        }
    }

    /**
     * Check current connection status
     */
    async checkConnection(): Promise<boolean> {
        try {
            const state = await NetInfo.fetch();
            const isConnected = state.isConnected ?? false;

            useNetworkStore.getState().setNetworkState({
                isConnected,
                isInternetReachable: state.isInternetReachable,
                connectionType: state.type,
            });

            return isConnected;
        } catch (error) {
            console.error('Error checking network connection:', error);
            return false;
        }
    }

    /**
     * Add a listener for connection changes
     */
    addListener(listener: (isConnected: boolean) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /**
     * Check if currently connected
     */
    get isConnected(): boolean {
        return useNetworkStore.getState().isConnected;
    }
}

export const networkMonitor = new NetworkMonitor();
