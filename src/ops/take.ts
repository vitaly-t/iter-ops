import {Piper} from '../types';

/**
 * Emits up to "count" number of values.
 */
export function take<T>(count: number): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, stopped = false;
            return {
                next(): IteratorResult<T> {
                    if (!stopped) {
                        const a = i.next();
                        if (a.done || index++ >= count) {
                            stopped = true;
                        } else {
                            return a;
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
