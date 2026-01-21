import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ListTodo, Calendar, Timer, BarChart3, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';
import { getColors } from '../../constants/colors';

export default function TabLayout() {
    const { isDark } = useThemeStore();
    const { t } = useTranslation();
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
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 1,
                    shadowRadius: 8,
                    elevation: 8,
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
                    title: t('tabs.today'),
                    tabBarIcon: ({ color, size }) => (
                        <Home size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='tasks'
                options={{
                    title: t('tabs.tasks'),
                    tabBarIcon: ({ color, size }) => (
                        <ListTodo size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='calendar'
                options={{
                    title: t('tabs.calendar'),
                    tabBarIcon: ({ color, size }) => (
                        <Calendar size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='pomo'
                options={{
                    title: t('tabs.pomo'),
                    tabBarIcon: ({ color, size }) => (
                        <Timer size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='analytics'
                options={{
                    title: t('tabs.analytics'),
                    tabBarIcon: ({ color, size }) => (
                        <BarChart3 size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: t('tabs.profile'),
                    tabBarIcon: ({ color, size }) => (
                        <User size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
