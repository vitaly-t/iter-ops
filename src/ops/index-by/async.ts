import {$A, AsyncOperation, IterationState} from '../../types';
import {isPromiseLike} from '../../typeguards';

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
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): AsyncOperation<T, IIndexedValue<T>> {
    return (iterable) => ({
        [$A]() {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = -1;
            return {
                next() {
                    return i.next().then((a) => {
                        if (a.done) {
                            return a;
                        }
                        const r = cb(
                            a.value,
                            ++index,
                            state
                        ) as Promise<boolean>;
                        const out = (flag: any) =>
                            flag
                                ? {value: {index, value: a.value}, done: false}
                                : this.next();
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    });
}
