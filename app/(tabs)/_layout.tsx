import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ListTodo, Calendar, Timer, BarChart3, User } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors } from '../../constants/colors';

export default function TabLayout() {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surfaceSolid,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Bugün',
                    tabBarIcon: ({ color, size }) => (
                        <Home size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='tasks'
                options={{
                    title: 'Görevler',
                    tabBarIcon: ({ color, size }) => (
                        <ListTodo size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='calendar'
                options={{
                    title: 'Takvim',
                    tabBarIcon: ({ color, size }) => (
                        <Calendar size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='pomo'
                options={{
                    title: 'Pomo',
                    tabBarIcon: ({ color, size }) => (
                        <Timer size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='analytics'
                options={{
                    title: 'Analitik',
                    tabBarIcon: ({ color, size }) => (
                        <BarChart3 size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, size }) => (
                        <User size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

