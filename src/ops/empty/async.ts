import {$A, AsyncOperation} from '../../types';

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
export function empty(): AsyncOperation<unknown, never> {
    return () => ({
        [$A]: () => ({
            next() {
                return Promise.resolve({value: undefined, done: true});
            },
        }),
    });
}
