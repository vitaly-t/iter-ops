import {IterationState, Piper} from '../types';

/**
 * Standard filter logic for the iterable, extended for supporting iteration state.
 *
 * See also: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */
export function filter<T>(cb: (value: T, index: number, state: IterationState) => boolean): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a;
                    do {
                        a = i.next();
                        if (!a.done && cb(a.value, index++, state)) {
                            return a;
                        }
                    } while (!a.done);
                    return a;
                }
            };
        }
    });
}
