import {$S, IterationState, SyncOperation} from '../../types';

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array.every} logic for the iterable,
 * extended with iteration state + async.
 *
 * It emits a `boolean`, indicating whether all elements pass the predicate test.
 *
 * ```ts
 * import {pipe, every} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     every(a => a % 2 === 0) // checks if every number is even
 * );
 *
 * console.log(...i); //=> false
 *
 * console.log(i.first); //=> false
 * ```
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array.every}
 *  - {@link some}
 * @category Operations
 */
export function every<T>(
    cb: (value: T, index: number, state: IterationState) => boolean
): SyncOperation<T, boolean> {
    return (iterable) => ({
        [$S](): Iterator<boolean> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0,
                finished: boolean;
            return {
                next(): IteratorResult<boolean> {
                    if (!finished) {
                        let a;
                        while (
                            !(a = i.next()).done &&
                            cb(a.value, index++, state)
                        );
                        finished = true;
                        return {value: !!a.done, done: false};
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    });
}
