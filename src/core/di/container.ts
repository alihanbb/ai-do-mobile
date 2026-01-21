/**
 * Dependency Injection Container
 * Provides centralized access to all repositories and use cases
 */

// Repositories
import { IFocusRepository } from '../../features/focus/domain/repositories/IFocusRepository';
import { LocalFocusRepository } from '../../features/focus/infrastructure/repositories/LocalFocusRepository';
import { IFocusPresetRepository } from '../../features/focus/domain/repositories/IFocusPresetRepository';
import { LocalFocusPresetRepository } from '../../features/focus/infrastructure/repositories/LocalFocusPresetRepository';

// Use Cases
import { StartFocusSession } from '../../features/focus/application/use-cases/StartFocusSession';
import { CompleteFocusSession } from '../../features/focus/application/use-cases/CompleteFocusSession';
import { GetFocusStats } from '../../features/focus/application/use-cases/GetFocusStats';
import { GetHourlyStats } from '../../features/focus/application/use-cases/GetHourlyStats';
import { GetTimelineData } from '../../features/focus/application/use-cases/GetTimelineData';
import { GetFocusSessions } from '../../features/focus/application/use-cases/GetFocusSessions';

class Container {
    // Singleton repositories
    private _focusRepository?: IFocusRepository;
    private _focusPresetRepository?: IFocusPresetRepository;

    // Repositories
    get focusRepository(): IFocusRepository {
        if (!this._focusRepository) {
            this._focusRepository = new LocalFocusRepository();
        }
        return this._focusRepository;
    }

    get focusPresetRepository(): IFocusPresetRepository {
        if (!this._focusPresetRepository) {
            this._focusPresetRepository = new LocalFocusPresetRepository();
        }
        return this._focusPresetRepository;
    }

    // Focus Use Cases
    get startFocusSession(): StartFocusSession {
        return new StartFocusSession(this.focusRepository);
    }

    get completeFocusSession(): CompleteFocusSession {
        return new CompleteFocusSession(this.focusRepository);
    }

    get getFocusStats(): GetFocusStats {
        return new GetFocusStats();
    }

    get getHourlyStats(): GetHourlyStats {
        return new GetHourlyStats();
    }

    get getTimelineData(): GetTimelineData {
        return new GetTimelineData();
    }

    get getFocusSessions(): GetFocusSessions {
        return new GetFocusSessions(this.focusRepository);
    }

    // Reset for testing
    reset(): void {
        this._focusRepository = undefined;
        this._focusPresetRepository = undefined;
    }
}

export const container = new Container();
