// src/core/infrastructure/analytics/analyticsService.ts
// Analytics service abstraction (Firebase-ready)
// Note: Firebase packages require additional native configuration.
// For now, this is a mock implementation that can be swapped with real Firebase.

interface AnalyticsEvent {
    name: string;
    params?: Record<string, string | number | boolean>;
}

class AnalyticsService {
    private isEnabled = true;
    private userId: string | null = null;

    /**
     * Initialize analytics service
     * In production, this would initialize Firebase Analytics
     */
    async initialize(): Promise<void> {
        if (__DEV__) {
            console.log('[Analytics] Initialized in development mode');
            return;
        }

        // Firebase initialization would go here:
        // import analytics from '@react-native-firebase/analytics';
        // await analytics().setAnalyticsCollectionEnabled(true);
        console.log('[Analytics] Ready');
    }

    /**
     * Set user ID for tracking
     */
    async setUserId(userId: string): Promise<void> {
        this.userId = userId;
        if (__DEV__) {
            console.log(`[Analytics] User ID set: ${userId}`);
            return;
        }

        // Firebase: await analytics().setUserId(userId);
    }

    /**
     * Set user properties
     */
    async setUserProperties(properties: Record<string, string>): Promise<void> {
        if (__DEV__) {
            console.log('[Analytics] User properties:', properties);
            return;
        }

        // Firebase: await analytics().setUserProperties(properties);
    }

    /**
     * Log a custom event
     */
    async logEvent(name: string, params?: Record<string, string | number | boolean>): Promise<void> {
        if (!this.isEnabled) return;

        if (__DEV__) {
            console.log(`[Analytics] Event: ${name}`, params);
            return;
        }

        // Firebase: await analytics().logEvent(name, params);
    }

    /**
     * Log screen view
     */
    async logScreenView(screenName: string, screenClass?: string): Promise<void> {
        if (!this.isEnabled) return;

        if (__DEV__) {
            console.log(`[Analytics] Screen: ${screenName}`);
            return;
        }

        // Firebase: await analytics().logScreenView({ screen_name: screenName, screen_class: screenClass });
    }

    // ===== Predefined Events =====

    /**
     * Log task created event
     */
    async logTaskCreated(category?: string, priority?: string): Promise<void> {
        await this.logEvent('task_created', {
            category: category || 'none',
            priority: priority || 'medium',
        });
    }

    /**
     * Log task completed event
     */
    async logTaskCompleted(category?: string, priority?: string): Promise<void> {
        await this.logEvent('task_completed', {
            category: category || 'none',
            priority: priority || 'medium',
        });
    }

    /**
     * Log pomodoro session completed
     */
    async logPomodoroCompleted(durationMinutes: number, mode: string): Promise<void> {
        await this.logEvent('pomodoro_completed', {
            duration_minutes: durationMinutes,
            mode,
        });
    }

    /**
     * Log login event
     */
    async logLogin(method: string = 'email'): Promise<void> {
        await this.logEvent('login', { method });
    }

    /**
     * Log signup event
     */
    async logSignUp(method: string = 'email'): Promise<void> {
        await this.logEvent('sign_up', { method });
    }

    /**
     * Enable/disable analytics collection
     */
    setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }
}

export const analyticsService = new AnalyticsService();
