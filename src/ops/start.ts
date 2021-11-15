import {Piper} from '../types';

/**
 * Starts producing values after the callback returns a truthy value.
 */
export function start<T>(cb: (value: T, index: number) => boolean): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, started = false;
            return {
                next(): IteratorResult<T> {
                    if (started) {
                        return i.next();
                    }
                    let a;
                    do {
                        a = i.next();
                        if (!a.done && cb(a.value, index++)) {
                            started = true;
                            return a;
                        }
                    } while (!a.done);
                    return a;
                }
            };
        }
    });
}
