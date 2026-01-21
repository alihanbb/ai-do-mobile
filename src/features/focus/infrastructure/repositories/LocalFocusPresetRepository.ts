/**
 * Local Focus Preset Repository
 * AsyncStorage-based implementation for presets
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Result } from '../../../../core/types/Result';
import { FocusPreset, FocusPresetProps, DEFAULT_PRESETS } from '../../domain/entities/FocusPreset';
import { IFocusPresetRepository } from '../../domain/repositories/IFocusPresetRepository';

const PRESETS_KEY = 'focus_presets';
const ACTIVE_PRESET_KEY = 'focus_active_preset';

export class LocalFocusPresetRepository implements IFocusPresetRepository {
    async getAll(): Promise<Result<FocusPreset[]>> {
        try {
            const data = await AsyncStorage.getItem(PRESETS_KEY);

            if (!data) {
                // Return default presets on first load
                return Result.ok(DEFAULT_PRESETS.map(p => FocusPreset.fromProps(p)));
            }

            const props = JSON.parse(data) as FocusPresetProps[];
            return Result.ok(props.map(p => FocusPreset.fromProps(p)));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async save(preset: FocusPreset): Promise<Result<void>> {
        try {
            const allResult = await this.getAll();
            if (allResult.isFailure) return Result.fail(allResult.error);

            const presets = allResult.value.map(p => p.toProps());
            const index = presets.findIndex(p => p.id === preset.id);

            if (index >= 0) {
                presets[index] = preset.toProps();
            } else {
                presets.push(preset.toProps());
            }

            await AsyncStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async delete(id: string): Promise<Result<void>> {
        try {
            const allResult = await this.getAll();
            if (allResult.isFailure) return Result.fail(allResult.error);

            const filtered = allResult.value
                .filter(p => p.id !== id)
                .map(p => p.toProps());

            await AsyncStorage.setItem(PRESETS_KEY, JSON.stringify(filtered));
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async getActive(): Promise<Result<FocusPreset | null>> {
        try {
            const activeId = await AsyncStorage.getItem(ACTIVE_PRESET_KEY);

            if (!activeId) {
                // Return first default preset
                return Result.ok(FocusPreset.fromProps(DEFAULT_PRESETS[0]));
            }

            const allResult = await this.getAll();
            if (allResult.isFailure) return Result.fail(allResult.error);

            const active = allResult.value.find(p => p.id === activeId);
            return Result.ok(active || null);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async setActive(presetId: string): Promise<Result<void>> {
        try {
            await AsyncStorage.setItem(ACTIVE_PRESET_KEY, presetId);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
