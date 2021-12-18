import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Spreads iterable values.
 *
 * The source iterable is expected to emit iterable values only.
 *
 * ```ts
 * import {pipe, spread} from 'iter-ops';
 *
 * const i = pipe(
 *     ['first', 'second'],
 *     spread()
 * );
 *
 * console.log(...i); //=> 'f', 'i', 'r', 's', 't', 's', 'e', 'c', 'o', 'n', 'd'
 * ```
 *
 * It will throw an iteration-time error, if a non-iterable value is encountered.
 *
 * @category Sync+Async
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
                            a = i.next();
                            start = false;
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

function spreadAsync<T>(iterable: AsyncIterable<Iterable<T> | AsyncIterable<T>>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            let a: IteratorResult<any>, k: Iterator<T> | AsyncIterator<T>,
                v: IteratorResult<T>,
                start = true, index = 0;
            return {
                async next(): Promise<IteratorResult<T>> {
                    do {
                        if (start) {
                            a = await i.next();
                            start = false;
                            if (!a.done) {
                                k = a.value?.[Symbol.iterator]?.() || a.value?.[Symbol.asyncIterator]?.();
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