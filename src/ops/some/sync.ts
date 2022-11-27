import {$S, IterationState, SyncOperation} from '../../types';

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array.some} logic for the iterable,
 * extended with iteration state + async.
 *
 * It emits a `boolean`, indicating whether at least one element passes the predicate test.
 *
 * ```ts
 * import {pipe, some} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     some(a => a % 2 === 0) // checks if even numbers are present
 * );
 *
 * console.log(...i); //=> true
 *
 * console.log(i.first); //=> true
 * ```
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array.some}
 *  - {@link every}
 * @category Operations
 */
export function some<T>(
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
                            !cb(a.value, index++, state)
                        );
                        finished = true;
                        return {value: !a.done, done: false};
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    });
}
