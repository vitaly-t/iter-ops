import {IterationState, Piper} from '../types';

/**
 * Taps into each value, without changing the output.
 */
export function tap<T>(cb: (value: T, index: number, state: IterationState) => void): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    if (!a.done) {
                        cb(a.value, index++, state);
                    }
                    return a;
                }
            };
        }
    });
}
