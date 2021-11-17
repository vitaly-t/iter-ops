import {Piper} from '../types';

/**
 * Starts emitting values after the predicate returns a truthy value.
 */
export function start<T>(cb: (value: T, index: number) => boolean): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, done = false;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!done) {
                        while (!a.done && !cb(a.value, index++)) {
                            a = i.next();
                        }
                        done = true;
                    }
                    return a;
                }
            };
        }
    });
}
