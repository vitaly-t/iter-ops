import {$A, $S, IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Standard reducer for the iterable, extended for supporting iteration state.
 *
 * Below is an example of calculating the average from a sequence of numbers:
 *
 * ```ts
 * import {pipe, reduce} from 'iter-ops';
 *
 * const input = [3, 0, -2, 5, 9, 4];
 *
 * const i = pipe(input, reduce((p, c, idx, state) => {
 *     state.sum = idx > 0 ? state.sum + c : c;
 *     return state.sum / (idx + 1);
 * }, 0));
 *
 * console.log(...i); //=> 3.1666(6)
 * ```
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce Array.reduce}
 *
 * @category Sync+Async
 */
export function reduce<T, R = T>(
    cb: (
        previousValue: R,
        currentValue: T,
        index: number,
        state: IterationState
    ) => R,
    initialValue?: R
): Operation<T, R>;

export function reduce(...args: unknown[]) {
    return createOperation(reduceSync, reduceAsync, args);
}

function reduceSync<T>(
    iterable: Iterable<T>,
    cb: (
        previousValue: T,
        currentValue: T,
        index: number,
        state: IterationState
    ) => T,
    initialValue?: T
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let done = false,
                index = 0;
            return {
                next(): IteratorResult<T> {
                    let value;
                    if (done) {
                        return {value, done};
                    }
                    value = initialValue as T;
                    let a;
                    while (!(a = i.next()).done) {
                        if (!index && value === undefined) {
                            value = a.value;
                            index++;
                        } else {
                            value = cb(value, a.value, index++, state);
                        }
                    }
                    done = true;
                    return {value, done: false};
                },
            };
        },
    };
}

function reduceAsync<T>(
    iterable: AsyncIterable<T>,
    cb: (
        previousValue: T,
        currentValue: T,
        index: number,
        state: IterationState
    ) => T,
    initialValue?: T
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let finished = false,
                index = 0,
                value = initialValue as T;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            if (finished) {
                                return a;
                            }
                            finished = true;
                            return {value, done: false};
                        }
                        if (!index && value === undefined) {
                            value = a.value;
                            index++;
                        } else {
                            value = cb(value, a.value, index++, state);
                        }
                        return this.next();
                    });
                },
            };
        },
    };
}
