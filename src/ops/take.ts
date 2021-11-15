import {Piper} from '../types';

/**
 * Produces up to `count` number of values.
 */
export function take<T>(count: number): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0;
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
