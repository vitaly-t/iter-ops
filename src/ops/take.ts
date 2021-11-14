import {Piper} from '../types';

/**
 * Produces up to `count` number of values.
 */
export function take<T>(count: number): Piper<T, T> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            let index = 0, i = iterator[Symbol.iterator]();
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    if (a.done || index++ >= count) {
                        return {value: undefined, done: true};
                    }
                    return a;
                }
            };
        }
    });
}
