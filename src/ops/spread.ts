import {Operation} from '../types';
import {createOperation} from '../shared';

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
            let k: any, start = true, index = 0, sync: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    const nextValue = (wrap: boolean): Promise<IteratorResult<T>> => {
                        const out = (v: IteratorResult<T>) => {
                            if (!v.done) {
                                return sync && wrap ? Promise.resolve(v) : v;
                            }
                            start = true;
                            return this.next();
                        };
                        const r = k.next();
                        return sync ? out(r) : r.then(out);
                    };
                    if (start) {
                        start = false;
                        return i.next().then((a: IteratorResult<any>) => {
                            if (a.done) {
                                return a;
                            }
                            sync = true;
                            k = a.value?.[Symbol.iterator]?.();
                            if (!k) {
                                sync = false;
                                k = a.value?.[Symbol.asyncIterator]?.();
                            }
                            if (!k) {
                                throw new TypeError(`Value at index ${index} is not iterable: ${JSON.stringify(a.value)}`);
                            }
                            index++;
                            return nextValue(false);
                        });
                    }
                    return nextValue(true);
                }
            };
        }
    };
}
