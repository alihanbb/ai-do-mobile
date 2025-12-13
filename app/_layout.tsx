import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from '../components/shared/ThemeProvider';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useTaskStore } from '../store/taskStore';
import { usePomoStore } from '../store/pomoStore';
import { getColors, spacing } from '../constants/colors';

function RootLayoutContent() {
    const router = useRouter();
    const segments = useSegments();
    const navigationState = useRootNavigationState();
    const { isAuthenticated, isInitialized, hydrateAuth } = useAuthStore();
    const { isDark } = useThemeStore();
    const { initialize: initializeTasks } = useTaskStore();
    const { initialize: initializePomo } = usePomoStore();
    const colors = getColors(isDark);
    const [isReady, setIsReady] = useState(false);
    // Track if user has seen onboarding THIS session (resets on app restart)
    const [hasSeenOnboardingThisSession, setHasSeenOnboardingThisSession] = useState(false);

    // Initialize auth, task, and pomo state
    useEffect(() => {
        const init = async () => {
            await hydrateAuth();
            await initializeTasks();
            await initializePomo();
            setIsReady(true);
        };
        init();
    }, []);

    // Handle navigation based on auth state
    useEffect(() => {
        if (!isReady || !navigationState?.key) return;

        const segmentArray = segments as string[];
        const inAuthGroup = segmentArray[0] === '(auth)';
        const currentScreen = segmentArray.length > 1 ? segmentArray[1] : '';

        console.log('📍 Navigation Debug:', {
            hasSeenOnboardingThisSession,
            isAuthenticated,
            inAuthGroup,
            currentScreen,
            segments: segmentArray,
        });

        // Always show onboarding first on each app launch
        if (!hasSeenOnboardingThisSession && currentScreen !== 'onboarding') {
            console.log('🚀 Redirecting to onboarding...');
            router.replace('/(auth)/onboarding');
            return;
        }

        // After onboarding, check authentication
        if (hasSeenOnboardingThisSession && !isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)/login');
            return;
        }

        if (hasSeenOnboardingThisSession && isAuthenticated && inAuthGroup && currentScreen !== 'onboarding') {
            router.replace('/(tabs)');
            return;
        }
    }, [isAuthenticated, isReady, hasSeenOnboardingThisSession, segments, navigationState?.key]);

    // Export function to mark onboarding as seen (will be called from onboarding screen)
    useEffect(() => {
        (global as any).markOnboardingSeen = () => {
            setHasSeenOnboardingThisSession(true);
        };
    }, []);

    if (!isReady || !isInitialized) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
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
        <ThemeProvider>
            <RootLayoutContent />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

