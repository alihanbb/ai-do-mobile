/**
 * Focus Store
 * Thin UI state store - business logic is in use cases
 */
import { create } from 'zustand';
import { FocusMode, TimerState, FocusSessionProps } from '../../domain/entities/FocusSession';
import { FocusPresetProps } from '../../domain/entities/FocusPreset';

interface FocusState {
    // Timer state
    timerState: TimerState;
    mode: FocusMode;
    remainingSeconds: number;
    elapsedSeconds: number;

    // Current session
    currentSession: FocusSessionProps | null;

    // Linked task
    linkedTaskId: string | null;
    linkedTaskTitle: string | null;

    // Presets
    activePreset: FocusPresetProps | null;
    presets: FocusPresetProps[];

    // Sessions cache
    sessions: FocusSessionProps[];

    // Loading state
    isLoading: boolean;
    error: string | null;
    initialized: boolean;
}

interface FocusActions {
    // Timer actions
    setTimerState: (state: TimerState) => void;
    setMode: (mode: FocusMode) => void;
    setRemainingSeconds: (seconds: number) => void;
    tick: () => void;
    resetTimer: () => void;

    // Session actions
    setCurrentSession: (session: FocusSessionProps | null) => void;

    // Task linking
    setLinkedTask: (taskId: string | null, taskTitle: string | null) => void;

    // Preset actions
    setActivePreset: (preset: FocusPresetProps | null) => void;
    setPresets: (presets: FocusPresetProps[]) => void;

    // Sessions
    setSessions: (sessions: FocusSessionProps[]) => void;
    addSession: (session: FocusSessionProps) => void;

    // Loading
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Initialize
    initialize: () => Promise<void>;
}

const initialState: FocusState = {
    timerState: 'idle',
    mode: 'pomodoro',
    remainingSeconds: 25 * 60,
    elapsedSeconds: 0,
    currentSession: null,
    linkedTaskId: null,
    linkedTaskTitle: null,
    activePreset: null,
    presets: [],
    sessions: [],
    isLoading: false,
    error: null,
    initialized: false,
};

export const useFocusStore = create<FocusState & FocusActions>((set, get) => ({
    ...initialState,

    // Timer actions
    setTimerState: (timerState) => set({ timerState }),
    setMode: (mode) => set({ mode }),
    setRemainingSeconds: (remainingSeconds) => set({ remainingSeconds }),

    tick: () => {
        const { mode, remainingSeconds, elapsedSeconds } = get();
        if (mode === 'pomodoro') {
            set({ remainingSeconds: Math.max(0, remainingSeconds - 1) });
        } else {
            set({ elapsedSeconds: elapsedSeconds + 1 });
        }
    },

    resetTimer: () => {
        const { activePreset, mode } = get();
        set({
            timerState: 'idle',
            remainingSeconds: mode === 'pomodoro'
                ? (activePreset?.durationMinutes || 25) * 60
                : 0,
            elapsedSeconds: 0,
            currentSession: null,
        });
    },

    // Session actions
    setCurrentSession: (currentSession) => set({ currentSession }),

    // Task linking
    setLinkedTask: (linkedTaskId, linkedTaskTitle) => set({ linkedTaskId, linkedTaskTitle }),

    // Preset actions
    setActivePreset: (activePreset) => {
        if (activePreset) {
            set({
                activePreset,
                mode: activePreset.mode,
                remainingSeconds: activePreset.durationMinutes * 60,
            });
        } else {
            set({ activePreset });
        }
    },
    setPresets: (presets) => set({ presets }),

    // Sessions
    setSessions: (sessions) => set({ sessions }),
    addSession: (session) => set((state) => ({
        sessions: [...state.sessions, session]
    })),

    // Loading
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Initialize
    initialize: async () => {
        // Initialize is handled by useFocusTimer hook
        // This is just for backward compatibility
        set({ initialized: true });
    },
}));
