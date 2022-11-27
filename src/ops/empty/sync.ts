import {$S, SyncOperation} from '../../types';

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
export function empty(): SyncOperation<unknown, never> {
    return () => ({
        [$S]: () => ({next: () => ({value: undefined, done: true})}),
    });
}
