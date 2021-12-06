import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Spreads iterable values.
 *
 * It requires that the input iterable emits iterable values only,
 * or else it will throw an error.
 */
export function spread<T>(): Operation<Iterable<T> | AsyncIterable<T>, T> {
    return createOperation(spreadSync as any, spreadAsync as any);
}

function spreadSync<T>(iterable: Iterable<Iterable<T>>): Iterable<T> {
    return {
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
    };
}

function spreadAsync<T>(iterable: AsyncIterable<AsyncIterable<T>>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            let a: IteratorResult<AsyncIterable<T>>, k: AsyncIterator<T>, v: IteratorResult<T>,
                start = true, index = 0;
            return {
                async next(): Promise<IteratorResult<T>> {
                    do {
                        if (start) {
                            start = false;
                            a = await i.next();
                            if (!a.done) {
                                k = a.value?.[Symbol.asyncIterator]?.();
                                if (!k) {
                                    throw new TypeError(`Value at index ${index} is not iterable: ${JSON.stringify(a.value)}`);
                                }
                            }
                            index++;
                        }
                        if (!a.done) {
                            v = await k.next();
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
    };
}