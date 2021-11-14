import {Piper} from './common';

/**
 * Stops the iterator when the callback returns a truthy value.
 */
export function stop<T>(cb: (value: T, index: number) => boolean): Piper<T, T> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            let index = 0, i = iterator[Symbol.iterator]();
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    if (a.done || cb(a.value, index++)) {
                        return {value: undefined, done: true};
                    }
                    return a;
                }
            };
        }
    });
}
