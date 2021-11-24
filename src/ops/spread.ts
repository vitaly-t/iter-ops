import {Piper} from '../types';

/**
 * Spreads iterable values.
 */
export function spread<T>(): Piper<Iterable<T>, T> {
    return (iterable: Iterable<Iterable<T>>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let a: IteratorResult<Iterable<T>>, k: Iterator<T>, v: IteratorResult<T>, start = true;
            return {
                next(): IteratorResult<T> {
                    do {
                        if (start) {
                            start = false;
                            a = i.next();
                            if (!a.done) {
                                k = a.value[Symbol.iterator]();
                            }
                        }
                        if (!a.done) {
                            v = k.next();
                            if (!v.done) {
                                return v;
                            }
                            start = true;
                        }
                    } while (!a.done);
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
