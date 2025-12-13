import { create } from 'zustand';
import {
    TimerMode,
    TimerState,
    TimerPreset,
    FocusSessionProps,
    FocusStats,
    DayStats,
    defaultPresets,
    FocusSession,
} from '../../domain/entities/FocusSession';
import { pomoRepository } from '../../infrastructure/repositories/PomoRepository';

const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const getTodayString = (): string => {
    return new Date().toISOString().split('T')[0];
};

interface PomoState {
    mode: TimerMode;
    timerState: TimerState;
    remainingTime: number;
    elapsedTime: number;
    presets: TimerPreset[];
    activePreset: TimerPreset | null;
    sessions: FocusSessionProps[];
    currentSessionStart: Date | null;
    initialized: boolean;
    initialize: () => Promise<void>;
    setMode: (mode: TimerMode) => void;
    setActivePreset: (preset: TimerPreset) => void;
    startTimer: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    resetTimer: () => void;
    tick: () => void;
    completeSession: () => Promise<void>;
    addPreset: (preset: TimerPreset) => Promise<void>;
    removePreset: (id: string) => Promise<void>;
    getStats: () => FocusStats;
    getTodaySessions: () => FocusSessionProps[];
}

export const usePomoStore = create<PomoState>((set, get) => ({
    mode: 'pomo',
    timerState: 'idle',
    remainingTime: 25 * 60,
    elapsedTime: 0,
    presets: defaultPresets,
    activePreset: defaultPresets[0],
    sessions: [],
    currentSessionStart: null,
    initialized: false,

    initialize: async () => {
        if (get().initialized) return;

        const sessionsResult = await pomoRepository.getSessions();
        const presetsResult = await pomoRepository.getPresets();
        const activePresetResult = await pomoRepository.getActivePreset();

        set({
            sessions: sessionsResult.isSuccess
                ? sessionsResult.value.map(s => s.toJSON())
                : [],
            presets: presetsResult.isSuccess
                ? presetsResult.value
                : [...defaultPresets],
            activePreset: activePresetResult.isSuccess && activePresetResult.value
                ? activePresetResult.value
                : defaultPresets[0],
            initialized: true,
        });
    },

    setMode: (mode) => {
        const state = get();
        if (state.timerState !== 'idle') return;

        set({
            mode,
            remainingTime: mode === 'pomo' ? (state.activePreset?.duration || 25) * 60 : 0,
            elapsedTime: 0,
        });
    },

    setActivePreset: (preset) => {
        const state = get();
        if (state.timerState !== 'idle') return;

        pomoRepository.setActivePreset(preset);

        set({
            activePreset: preset,
            mode: preset.mode || 'pomo',
            remainingTime: preset.duration * 60,
            elapsedTime: 0,
        });
    },

    startTimer: () => {
        set({
            timerState: 'running',
            currentSessionStart: new Date(),
        });
    },

    pauseTimer: () => {
        set({ timerState: 'paused' });
    },

    resumeTimer: () => {
        set({ timerState: 'running' });
    },

    resetTimer: () => {
        const state = get();
        set({
            timerState: 'idle',
            remainingTime: state.mode === 'pomo' ? (state.activePreset?.duration || 25) * 60 : 0,
            elapsedTime: 0,
            currentSessionStart: null,
        });
    },

    tick: () => {
        const state = get();
        if (state.timerState !== 'running') return;

        if (state.mode === 'pomo') {
            const newRemaining = state.remainingTime - 1;
            if (newRemaining <= 0) {
                get().completeSession();
            } else {
                set({ remainingTime: newRemaining });
            }
        } else {
            set({ elapsedTime: state.elapsedTime + 1 });
        }
    },

    completeSession: async () => {
        const state = get();
        const preset = state.activePreset;
        const sessionStart = state.currentSessionStart;

        if (!sessionStart) return;

        const duration = state.mode === 'pomo'
            ? (preset?.duration || 25) * 60
            : state.elapsedTime;

        const newSession = FocusSession.start(state.mode, preset || undefined);
        // Manually set properties since FocusSession.start creates a new one
        const sessionProps: FocusSessionProps = {
            id: Date.now().toString(),
            mode: state.mode,
            duration,
            startedAt: sessionStart,
            endedAt: new Date(),
            pausedDuration: 0,
            completed: true,
            presetId: preset?.id,
            presetName: preset?.name,
            createdAt: sessionStart,
            updatedAt: new Date(),
        };

        // Save to repository
        await pomoRepository.saveSession(FocusSession.fromJSON(sessionProps));

        set((s) => ({
            sessions: [...s.sessions, sessionProps],
            timerState: 'completed',
            remainingTime: 0,
            currentSessionStart: null,
        }));
    },

    addPreset: async (preset) => {
        await pomoRepository.savePreset(preset);
        set((state) => ({
            presets: [...state.presets, preset],
        }));
    },

    removePreset: async (id) => {
        await pomoRepository.deletePreset(id);
        set((state) => ({
            presets: state.presets.filter((p) => p.id !== id),
        }));
    },

    getStats: () => {
        const sessions = get().sessions;

        const todaySessions = sessions.filter((s) => isToday(new Date(s.startedAt)));
        const todayPomoCount = todaySessions.filter((s) => s.mode === 'pomo' && s.completed).length;
        const todayFocusDuration = Math.round(
            todaySessions.reduce((acc, s) => acc + s.duration, 0) / 60
        );

        const totalPomoCount = sessions.filter((s) => s.mode === 'pomo' && s.completed).length;
        const totalFocusDuration = Math.round(
            sessions.reduce((acc, s) => acc + s.duration, 0) / 60
        );

        const weeklyData: DayStats[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const daySessions = sessions.filter((s) => {
                const sessionDate = new Date(s.startedAt).toISOString().split('T')[0];
                return sessionDate === dateStr;
            });

            weeklyData.push({
                date: dateStr,
                pomoCount: daySessions.filter((s) => s.mode === 'pomo' && s.completed).length,
                focusDuration: Math.round(
                    daySessions.reduce((acc, s) => acc + s.duration, 0) / 60
                ),
            });
        }

        return {
            totalSessions: sessions.length,
            totalFocusTime: totalFocusDuration,
            todaySessions: todaySessions.length,
            todayFocusTime: todayFocusDuration,
            averageSessionLength: sessions.length > 0 ? totalFocusDuration / sessions.length : 0,
            longestSession: sessions.reduce((max, s) => Math.max(max, s.duration / 60), 0),
            currentStreak: 0,
            todayPomoCount,
            todayFocusDuration,
            totalPomoCount,
            totalFocusDuration,
            weeklyData,
        };
    },

    getTodaySessions: () => {
        return get().sessions.filter((s) => isToday(new Date(s.startedAt)));
    },
}));
