/**
 * Focus Timer Hook
 * Orchestrates timer logic using use cases and store
 */
import { useCallback, useRef, useEffect } from 'react';
import { useFocusStore } from '../stores/useFocusStore';
import { container } from '../../../../core/di/container';
import { FocusPresetProps } from '../../domain/entities/FocusPreset';

export const useFocusTimer = () => {
    const store = useFocusStore();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize
    useEffect(() => {
        const init = async () => {
            store.setLoading(true);

            // Load sessions
            const sessionsResult = await container.getFocusSessions.execute();
            if (sessionsResult.isSuccess) {
                store.setSessions(sessionsResult.value.map(s => s.toProps()));
            }

            store.setLoading(false);
        };

        init();
    }, []);

    // Timer tick effect
    useEffect(() => {
        if (store.timerState === 'running') {
            timerRef.current = setInterval(() => {
                store.tick();

                // Check for completion (pomodoro mode)
                if (store.mode === 'pomodoro' && store.remainingSeconds <= 1) {
                    completeSession();
                }
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [store.timerState]);

    const start = useCallback(async () => {
        const result = await container.startFocusSession.execute({
            mode: store.mode,
            presetId: store.activePreset?.id,
            presetName: store.activePreset?.name,
            linkedTaskId: store.linkedTaskId || undefined,
            linkedTaskTitle: store.linkedTaskTitle || undefined,
        });

        if (result.isSuccess) {
            store.setCurrentSession(result.value.toProps());
            store.setTimerState('running');
        } else {
            store.setError(result.error.message);
        }
    }, [store]);

    const pause = useCallback(() => {
        store.setTimerState('paused');
    }, [store]);

    const resume = useCallback(() => {
        store.setTimerState('running');
    }, [store]);

    const reset = useCallback(() => {
        store.resetTimer();
    }, [store]);

    const completeSession = useCallback(async () => {
        if (!store.currentSession) return;

        const duration = store.mode === 'pomodoro'
            ? (store.activePreset?.durationMinutes || 25) * 60
            : store.elapsedSeconds;

        const result = await container.completeFocusSession.execute({
            sessionId: store.currentSession.id,
            durationSeconds: duration,
        });

        if (result.isSuccess) {
            store.addSession(result.value.toProps());
            store.setTimerState('completed');
            store.setCurrentSession(null);
        }
    }, [store]);

    const setPreset = useCallback((preset: FocusPresetProps) => {
        if (store.timerState !== 'idle') return;
        store.setActivePreset(preset);
    }, [store]);

    const setLinkedTask = useCallback((taskId: string | null, taskTitle: string | null) => {
        store.setLinkedTask(taskId, taskTitle);
    }, [store]);

    return {
        // State
        timerState: store.timerState,
        mode: store.mode,
        remainingSeconds: store.remainingSeconds,
        elapsedSeconds: store.elapsedSeconds,
        activePreset: store.activePreset,
        linkedTaskId: store.linkedTaskId,
        linkedTaskTitle: store.linkedTaskTitle,
        isLoading: store.isLoading,
        error: store.error,

        // Actions
        start,
        pause,
        resume,
        reset,
        completeSession,
        setPreset,
        setLinkedTask,
        setMode: store.setMode,
    };
};
