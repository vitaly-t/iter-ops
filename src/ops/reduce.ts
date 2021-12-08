import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Standard reducer for the iterable, extended for supporting iteration state.
 *
 * See also: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 */
export function reduce<T>(cb: (previousValue: T, currentValue: T, index: number, state: IterationState) => T, initialValue?: T): Operation<T, T> {
    return createOperation(reduceSync, reduceAsync, arguments);
}

function reduceSync<T>(iterable: Iterable<T>, cb: (previousValue: T, currentValue: T, index: number, state: IterationState) => T, initialValue?: T): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let done = false;
            return {
                next(): IteratorResult<T> {
                    let value;
                    if (done) {
                        return {value, done};
                    }
                    value = initialValue as T;
                    let index = 0, a;
                    while (!(a = i.next()).done) {
                        if (!index++ && value === undefined) {
                            value = a.value;
                            continue;
                        }
                        value = cb(value, a.value, index++, state);
                    }
                    done = true;
                    return {value, done: false};
                }
            };
        }
    };
}

function reduceAsync<T>(iterable: AsyncIterable<T>, cb: (previousValue: T, currentValue: T, index: number, state: IterationState) => T, initialValue?: T): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let finished = false, index = 0, value = initialValue as T;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (a.done) {
                            if (finished) {
                                return a;
                            }
                            finished = true;
                            return {value, done: false};
                        }
                        value = index++ === 0 && value === undefined ? a.value : cb(value, a.value, index++, state);
                        return this.next();
                    });
                }
            };
        }
    };
}
