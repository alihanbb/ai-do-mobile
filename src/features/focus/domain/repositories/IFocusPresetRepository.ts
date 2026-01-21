/**
 * Focus Preset Repository Interface
 * Contract for focus preset persistence
 */
import { Result } from '../../../../core/types/Result';
import { FocusPreset } from '../entities/FocusPreset';

export interface IFocusPresetRepository {
    getAll(): Promise<Result<FocusPreset[]>>;
    save(preset: FocusPreset): Promise<Result<void>>;
    delete(id: string): Promise<Result<void>>;
    getActive(): Promise<Result<FocusPreset | null>>;
    setActive(presetId: string): Promise<Result<void>>;
}
