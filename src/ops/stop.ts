import {IterationState, Piper} from '../types';

/**
 * Stops emitting values, once the predicate returns a truthy value.
 */
export function stop<T>(cb: (value: T, index: number, state: IterationState) => boolean): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state = {};
            let index = 0, done = false;
            return {
                next(): IteratorResult<T> {
                    if (!done) {
                        const a = i.next();
                        if (a.done || cb(a.value, index++, state)) {
                            done = true;
                        } else {
                            return a;
                        }
                    }
                    return {value: undefined, done};
                }
            };
        }
    });
}
