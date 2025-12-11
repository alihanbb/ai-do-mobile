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
    const { isAuthenticated, isInitialized, isOnboardingComplete, hydrateAuth } = useAuthStore();
    const { isDark } = useThemeStore();
    const { initialize: initializeTasks } = useTaskStore();
    const { initialize: initializePomo } = usePomoStore();
    const colors = getColors(isDark);
    const [isReady, setIsReady] = useState(false);

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

        const inAuthGroup = segments[0] === '(auth)';
        const currentScreen = segments.length > 1 ? segments[1] : '';

        // Don't redirect if we're already on the target screen
        if (!isOnboardingComplete && currentScreen !== 'onboarding') {
            router.replace('/(auth)/onboarding');
            return;
        }

        if (isOnboardingComplete && !isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)/login');
            return;
        }

        if (isOnboardingComplete && isAuthenticated && inAuthGroup && currentScreen !== 'onboarding') {
            router.replace('/(tabs)');
            return;
        }
    }, [isAuthenticated, isReady, isOnboardingComplete, segments, navigationState?.key]);

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

