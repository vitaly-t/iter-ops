import {$S, SyncOperation} from '../../types';

/**
 * Drains the iterable of all emitted values, and then emits an empty iterable.
 * Therefore, it cannot be used for infinite sequences.
 *
 * The operator doesn't change type of the previous iterable.
 *
 * ```ts
 * import {pipe, map, wait, drain, onEnd} from 'iter-ops';
 *
 * const i = pipe(
 *     iterable,
 *     map(a => myService.request(a)), // map into promise
 *     wait(), // resolve each promise
 *     drain(), // drain all values
 *     onEnd(s => {
 *         console.log('duration:', s.duration);
 *     })
 * );
 *
 * // Below, even though we trigger iteration just for the first value,
 * // onEnd will still be triggerred, because we drain the iterable:
 *
 * await i.first; // iterates to the first item
 * ```
 *
 * @see
 *  - {@link empty}
 *  - {@link isEmpty}
 *  - {@link defaultEmpty}
 * @category Operations
 */
export function drain<T>(): SyncOperation<T, never> {
    return (iterable) => ({
        [$S](): Iterator<never> {
            const i = iterable[$S]();
            return {
                next(): IteratorResult<never> {
                    while (!i.next().done);
                    return {value: undefined, done: true};
                },
            };
        },
    });
}
