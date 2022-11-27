import {$S, IterationState, SyncOperation} from '../../types';

import type {IIndexedValue} from './types';
export * from './types';

/**
 * Emits indexed values that pass the predicate test.
 *
 * ```ts
 * import {pipe, indexBy} from 'iter-ops';
 *
 * const i = pipe(
 *     [12, 7, 30, 9],
 *     indexBy(a => a % 2 === 0) // index even numbers
 * );
 *
 * console.log(...i); //=> {index: 0, value: 12}, {index: 2, value: 30}
 * ```
 *
 * @see
 *  - {@link IIndexedValue}
 *
 * @category Operations
 */
export function indexBy<T>(
    cb: (value: T, index: number, state: IterationState) => boolean
): SyncOperation<T, IIndexedValue<T>> {
    return (iterable) => ({
        [$S]() {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = -1;
            return {
                next() {
                    let a;
                    while (
                        !(a = i.next()).done &&
                        !cb(a.value, ++index, state)
                    );
                    return a.done
                        ? a
                        : {value: {index, value: a.value}, done: false};
                },
            };
        },
    });
}
