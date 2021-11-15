import {Piper} from '../types';

/**
 * Stops the iterator when the callback returns a truthy value.
 */
export function stop<T>(cb: (value: T, index: number) => boolean): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0;
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
