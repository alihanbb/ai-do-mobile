import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { sentryService } from './sentryService';

type SentryMiddleware = <
    T,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
    f: StateCreator<T, Mps, Mcs>,
    name?: string,
    options?: {
        exclude?: (keyof T)[];
        mask?: (keyof T)[];
    }
) => StateCreator<T, Mps, Mcs>;

type SentryMiddlewareImpl = <T>(
    f: StateCreator<T, [], []>,
    name?: string,
    options?: {
        exclude?: (keyof T)[];
        mask?: (keyof T)[];
    }
) => StateCreator<T, [], []>;

const sentryMiddlewareImpl: SentryMiddlewareImpl = (f, name, options) => (set, get, store) => {
    const loggedSet: typeof set = (...a) => {
        set(...a);
        const state = get();

        // Filter sensitive data
        const safeState = { ...state };

        if (options?.exclude) {
            options.exclude.forEach(key => {
                delete safeState[key];
            });
        }

        if (options?.mask) {
            options.mask.forEach(key => {
                if (safeState[key]) {
                    // @ts-ignore
                    safeState[key] = '***MASKED***';
                }
            });
        }

        sentryService.addBreadcrumb({
            category: 'state',
            message: `State Update: ${name || 'Unknown Store'}`,
            data: safeState as Record<string, unknown>,
            level: 'info'
        });
    };
    store.setState = loggedSet;

    return f(loggedSet, get, store);
};

export const sentryMiddleware = sentryMiddlewareImpl as unknown as SentryMiddleware;
