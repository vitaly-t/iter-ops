import {createDuelOperation} from '../utils';
import {$A, $S, AsyncOperation, DuelOperation, SyncOperation} from '../types';

/**
 * Emits an empty iterable, without pulling any values from the source,
 * i.e. it simply replaces the source iterable with an empty one.
 *
 * The operator doesn't change type of the previous iterable.
 *
 * @see
 *  - {@link drain}
 *  - {@link isEmpty}
 *  - {@link defaultEmpty}
 * @category Sync+Async
 */
export function empty(): DuelOperation<unknown, never> {
    return createDuelOperation(emptySync, emptyAsync);
}

/**
 * Emits an empty iterable, without pulling any values from the source,
 * i.e. it simply replaces the source iterable with an empty one.
 *
 * The operator doesn't change type of the previous iterable.
 *
 * @see
 *  - {@link drain}
 *  - {@link isEmpty}
 *  - {@link defaultEmpty}
 * @category Operations
 */
export function emptySync(): SyncOperation<unknown, never> {
    return () => ({
        [$S]: () => ({next: () => ({value: undefined, done: true})}),
    });
}

/**
 * Emits an empty iterable, without pulling any values from the source,
 * i.e. it simply replaces the source iterable with an empty one.
 *
 * The operator doesn't change type of the previous iterable.
 *
 * @see
 *  - {@link drain}
 *  - {@link isEmpty}
 *  - {@link defaultEmpty}
 * @category Operations
 */
export function emptyAsync(): AsyncOperation<unknown, never> {
    return () => ({
        [$A]: () => ({
            next() {
                return Promise.resolve({value: undefined, done: true});
            },
        }),
    });
}
