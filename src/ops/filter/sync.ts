import {$S, IterationState, SyncOperation} from '../../types';

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter} logic for the iterable,
 * extended with iteration state.
 *
 * In the example below, we are able to use a type guard to filter out all the nullable values.
 *
 * ```ts
 * import {pipe, filter} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, null, "foo"],
 *     filter((value): value is NonNullable<typeof value> => value != null)
 * );
 * ```
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.filter}
 * @category Operations
 */
export function filter<T, S extends T = T>(
    cb: (value: T, index: number, state: IterationState) => value is S
): SyncOperation<T, S> {
    return (iterable) => ({
        [$S](): Iterator<S> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<S> {
                    let a;
                    while (
                        !(a = i.next()).done &&
                        !cb(a.value, index++, state)
                    );
                    return a as IteratorResult<S>;
                },
            };
        },
    });
}
