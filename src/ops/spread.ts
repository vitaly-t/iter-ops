import {Operation} from '../types';

/**
 * Spreads iterable values.
 *
 * It requires that the input iterable emits iterable values only,
 * or else it will throw an error.
 */
export function spread<T>(): Operation<Iterable<T>, T> {
    return null as any;/*
    return (iterable: Iterable<Iterable<T>>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let a: IteratorResult<Iterable<T>>, k: Iterator<T>, v: IteratorResult<T>,
                start = true, index = 0;
            return {
                next(): IteratorResult<T> {
                    do {
                        if (start) {
                            start = false;
                            a = i.next();
                            if (!a.done) {
                                k = a.value?.[Symbol.iterator]?.();
                                if (!k) {
                                    throw new TypeError(`Value at index ${index} is not iterable: ${JSON.stringify(a.value)}`);
                                }
                            }
                            index++;
                        }
                        if (!a.done) {
                            v = k.next();
                            if (!v.done) {
                                return v;
                            }
                            start = true;
                        }
                    } while (!a.done);
                    return a;
                }
            };
        }
    });*/
}
