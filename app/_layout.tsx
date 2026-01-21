import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform as RNPlatform, Image } from 'react-native';
import { ThemeProvider, useTheme } from '../components/shared/ThemeProvider';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useTaskStore } from '../store/taskStore';
import { useFocusStore } from '../src/features/focus/presentation/stores/useFocusStore';
import { getColors, spacing } from '../constants/colors';

// Infrastructure services
import { networkMonitor } from '../src/core/infrastructure/network/networkMonitor';
import { offlineManager } from '../src/core/infrastructure/offline/offlineManager';
import { analyticsService } from '../src/core/infrastructure/analytics/analyticsService';
import { sentryService } from '../src/core/infrastructure/monitoring/sentryService';

// Initialize i18n
import '../src/core/infrastructure/i18n/i18n';

// Web-specific CSS import
if (RNPlatform.OS === 'web') {
    require('../assets/global.css');
}

function RootLayoutContent() {
    const router = useRouter();
    const segments = useSegments();
    const navigationState = useRootNavigationState();
    const { isAuthenticated, isInitialized, hydrateAuth, isOnboardingComplete } = useAuthStore();
    const { isDark } = useThemeStore();
    const { initialize: initializeTasks } = useTaskStore();
    const { initialize: initializeFocus } = useFocusStore();
    const colors = getColors(isDark);
    const [isReady, setIsReady] = useState(false);


    // Initialize auth, task, pomo, and infrastructure services
    useEffect(() => {
        const init = async () => {
            // Initialize crash reporting first
            await sentryService.initialize();

            // Initialize network monitoring
            networkMonitor.start();

            // Initialize offline queue
            await offlineManager.initialize();

            // Initialize analytics
            await analyticsService.initialize();

            // Initialize app state
            await hydrateAuth();
            await initializeTasks();
            await initializeFocus();

            setIsReady(true);
        };
        init();

        // Cleanup on unmount
        return () => {
            networkMonitor.stop();
        };
    }, []);

    // Handle navigation based on auth state
    useEffect(() => {
        if (!isReady || !isInitialized || !navigationState?.key) return;

        const segmentArray = segments as string[];
        const inAuthGroup = segmentArray[0] === '(auth)';
        const currentScreen = segmentArray.length > 1 ? segmentArray[1] : '';

        console.log('📍 Navigation Debug:', {
            isOnboardingComplete,
            isAuthenticated,
            inAuthGroup,
            currentScreen,
            segments: segmentArray,
        });

        // Use a small delay to ensure the layout is mounted before navigating
        const timeout = setTimeout(() => {
            // Always show onboarding first if not complete
            if (!isOnboardingComplete && currentScreen !== 'onboarding') {
                console.log('🚀 Redirecting to onboarding...');
                router.replace('/(auth)/onboarding');
                return;
            }

            // After onboarding, check authentication
            if (isOnboardingComplete && !isAuthenticated && !inAuthGroup) {
                console.log('🚀 Redirecting to login...');
                router.replace('/(auth)/login');
                return;
            }

            if (isOnboardingComplete && isAuthenticated && inAuthGroup && currentScreen !== 'onboarding') {
                console.log('🚀 Redirecting to tabs...');
                router.replace('/(tabs)');
                return;
            }
        }, 0);

        return () => clearTimeout(timeout);
    }, [isAuthenticated, isReady, isInitialized, isOnboardingComplete, segments, navigationState?.key]);

    // Export function to mark onboarding as seen (will be called from onboarding screen)
    useEffect(() => {
        (global as any).markOnboardingSeen = () => {
            const { completeOnboarding } = useAuthStore.getState();
            completeOnboarding();
        };
    }, []);

    if (!isReady || !isInitialized) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Image
                    source={require('../assets/splash-icon.png')}
                    style={{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 24 }}
                />
                <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                <Stack.Screen name='(auth)' options={{ headerShown: false }} />
                <Stack.Screen
                    name='task/[id]'
                    options={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                />
                <Stack.Screen
                    name='task/create'
                    options={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <RootLayoutContent />
            </ThemeProvider>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

