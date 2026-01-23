// src/core/infrastructure/monitoring/sentryService.ts
// Crash reporting and error monitoring service using Sentry

import * as Sentry from '@sentry/react-native';

import * as Application from 'expo-application';

interface SentryConfig {
    dsn?: string;
    environment?: string;
    tracesSampleRate?: number;
    debug?: boolean;
}

interface UserContext {
    id: string;
    email?: string;
    username?: string;
}

interface Breadcrumb {
    category?: string;
    message: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, unknown>;
}

class SentryService {
    private isInitialized = false;
    private isEnabled = true;

    /**
     * Initialize Sentry SDK
     * Requires EXPO_PUBLIC_SENTRY_DSN environment variable
     */
    async initialize(config?: SentryConfig): Promise<void> {
        if (this.isInitialized) return;

        const dsn = config?.dsn || process.env.EXPO_PUBLIC_SENTRY_DSN;

        if (!dsn) {
            console.warn('[Sentry] No DSN configured, crash reporting disabled');
            this.isEnabled = false;
            return;
        }

        try {
            const release = Application.nativeApplicationVersion
                ? `${Application.applicationId}@${Application.nativeApplicationVersion}+${Application.nativeBuildVersion}`
                : undefined;

            const dist = Application.nativeBuildVersion || undefined;

            Sentry.init({
                dsn,
                // Enable auto session tracking for crash-free users metric
                enableAutoSessionTracking: true,
                // Session ends after app is in background for 30 seconds
                sessionTrackingIntervalMillis: 30000,
                // Performance monitoring sample rate (0.2 = 20% of transactions)
                tracesSampleRate: config?.tracesSampleRate ?? (__DEV__ ? 1.0 : 0.2),
                // Environment (development, staging, production)
                environment: config?.environment || (__DEV__ ? 'development' : 'production'),
                // Enable debug mode in development
                debug: config?.debug ?? __DEV__,
                // Attach screenshots on crash (native only)
                attachScreenshot: true,
                // Attach view hierarchy on crash
                attachViewHierarchy: true,
                // Enable native crash handling
                enableNativeCrashHandling: true,
                // Enable auto performance tracking
                enableAutoPerformanceTracing: true,
                // Capture failed requests
                enableCaptureFailedRequests: true,
                // Set release name (should match source maps)
                release,
                // Set distribution for build variants
                dist,
                // Hooks for modifying events before sending
                beforeSend: (event) => {
                    // You can modify or filter events here
                    // Return null to drop the event
                    if (__DEV__) {
                        console.log('[Sentry] Event captured:', event.event_id);
                    }
                    return event;
                },
                // Hooks for modifying breadcrumbs
                beforeBreadcrumb: (breadcrumb) => {
                    // Filter out noisy breadcrumbs
                    if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
                        return null;
                    }
                    return breadcrumb;
                },
            });

            console.log('[Sentry] Initialized successfully');
            this.isInitialized = true;
        } catch (error) {
            console.error('[Sentry] Initialization failed:', error);
            this.isEnabled = false;
        }
    }

    /**
     * Capture an exception with optional context
     */
    captureException(error: Error, context?: Record<string, unknown>): string | undefined {
        if (!this.isEnabled) return undefined;

        if (__DEV__) {
            console.error('[Sentry] Exception:', error.message, context);
        }

        return Sentry.captureException(error, {
            extra: context,
        });
    }

    /**
     * Capture a message with severity level
     */
    captureMessage(
        message: string,
        level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'info',
        context?: Record<string, unknown>
    ): string | undefined {
        if (!this.isEnabled) return undefined;

        if (__DEV__) {
            console.log(`[Sentry] ${level.toUpperCase()}: ${message}`);
        }

        return Sentry.captureMessage(message, {
            level,
            extra: context,
        });
    }

    /**
     * Set user context for error reports
     * Call with null to clear user context on logout
     */
    setUser(user: UserContext | null): void {
        if (!this.isEnabled) return;

        if (__DEV__) {
            console.log('[Sentry] User set:', user?.id || 'cleared');
        }

        Sentry.setUser(user);
    }

    /**
     * Add breadcrumb for debugging crash reports
     * Breadcrumbs are like a trail of events leading up to a crash
     */
    addBreadcrumb(breadcrumb: Breadcrumb): void {
        if (!this.isEnabled) return;

        if (__DEV__) {
            console.log(`[Sentry] Breadcrumb: ${breadcrumb.message}`);
        }

        Sentry.addBreadcrumb({
            category: breadcrumb.category || 'app',
            message: breadcrumb.message,
            level: breadcrumb.level || 'info',
            data: breadcrumb.data,
            timestamp: Date.now() / 1000,
        });
    }

    /**
     * Set extra context that will be attached to all future events
     */
    setExtra(key: string, value: unknown): void {
        if (!this.isEnabled) return;

        Sentry.setExtra(key, value);
    }

    /**
     * Set tag for filtering and searching events
     */
    setTag(key: string, value: string): void {
        if (!this.isEnabled) return;

        Sentry.setTag(key, value);
    }

    /**
     * Set multiple tags at once
     */
    setTags(tags: Record<string, string>): void {
        if (!this.isEnabled) return;

        Sentry.setTags(tags);
    }

    /**
     * Start a performance transaction
     * Use this to measure specific operations
     */
    startTransaction(name: string, op: string): Sentry.Span | undefined {
        if (!this.isEnabled) return undefined;

        return Sentry.startInactiveSpan({
            name,
            op,
        });
    }

    /**
     * Execute an async function within a tracing span
     */
    async traceAsync<T>(
        name: string,
        op: string,
        task: () => Promise<T>,
        data?: Record<string, unknown>
    ): Promise<T> {
        if (!this.isEnabled) {
            return task();
        }

        return Sentry.startSpan({ name, op, attributes: data as any }, async () => {
            return await task();
        });
    }

    /**
     * Wrap a component with Sentry error boundary
     */
    wrap<P extends Record<string, unknown>>(component: React.ComponentType<P>): React.ComponentType<P> {
        if (!this.isEnabled) return component;

        return Sentry.wrap(component) as React.ComponentType<P>;
    }

    /**
     * Create a child span for performance tracing
     */
    startSpan<T>(options: { name: string; op: string }, callback: (span: Sentry.Span | undefined) => T): T {
        if (!this.isEnabled) {
            return callback(undefined);
        }

        return Sentry.startSpan(options, callback);
    }

    /**
     * Flush pending events before app closes
     */
    async flush(timeout: number = 2000): Promise<boolean> {
        if (!this.isEnabled) return true;

        try {
            await Sentry.flush();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Close the Sentry SDK
     */
    async close(): Promise<void> {
        if (!this.isEnabled) return;

        await Sentry.close();
        this.isInitialized = false;
    }

    /**
     * Check if Sentry is initialized and enabled
     */
    isReady(): boolean {
        return this.isInitialized && this.isEnabled;
    }

    /**
     * Get the Sentry React Native module for advanced usage
     * (e.g., wrapping navigation, error boundaries)
     */
    getSentry(): typeof Sentry {
        return Sentry;
    }
}

export const sentryService = new SentryService();

// Export Sentry for direct access when needed
export { Sentry };
