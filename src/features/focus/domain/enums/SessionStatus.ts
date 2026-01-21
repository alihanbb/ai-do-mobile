/**
 * Session Status Enum
 * Represents the completion status of a focus session
 */
export enum SessionStatus {
    /** Session is currently active */
    Active = 'active',
    /** Session was completed successfully */
    Completed = 'completed',
    /** Session was cancelled/abandoned */
    Cancelled = 'cancelled',
    /** Session was interrupted (app closed, phone call, etc.) */
    Interrupted = 'interrupted',
}

export const SessionStatusLabels: Record<SessionStatus, string> = {
    [SessionStatus.Active]: 'Aktif',
    [SessionStatus.Completed]: 'Tamamlandı',
    [SessionStatus.Cancelled]: 'İptal Edildi',
    [SessionStatus.Interrupted]: 'Kesintiye Uğradı',
};

export function isFinishedStatus(status: SessionStatus): boolean {
    return status !== SessionStatus.Active;
}

export function isSuccessfulStatus(status: SessionStatus): boolean {
    return status === SessionStatus.Completed;
}
