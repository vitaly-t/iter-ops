import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Creates a new iterable with all sub-iterable elements concatenated
 * into it recursively up to the specified depth.
 *
 * ```ts
 * import {pipe, flat} from 'iter-ops';
 *
 * const i = pipe(
 *     ['first', 'second'],
 *     spread()
 * );
 *
 * console.log(...i); //=> 'f', 'i', 'r', 's', 't', 's', 'e', 'c', 'o', 'n', 'd'
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.prototype.flat()}
 * @category Sync+Async
 */
export function flat<T>(
    depth?: number
): Operation<Iterable<T> | AsyncIterable<T>, T>;

export function flat(...args: unknown[]) {
    return createOperation(flatSync, flatAsync, args);
}

function flatSync<T>(
    iterable: Iterable<Iterable<T>>,
    depth: number = 1
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            let a: IteratorResult<Iterable<T>>,
                k: Iterator<T>,
                v: IteratorResult<T>,
                start = true,
                index = 0;
            return {
                next(): IteratorResult<T> {
                    do {
                        if (start) {
                            a = i.next();
                            start = false;
                            if (!a.done) {
                                k = a.value?.[$S]?.();
                                if (!k) {
                                    throw new TypeError(
                                        `Value at index ${index} is not iterable: ${JSON.stringify(
                                            a.value
                                        )}`
                                    );
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
                },
            };
        },
    };
}

function flatAsync<T>(
    iterable: AsyncIterable<Iterable<T> | AsyncIterable<T>>,
    depth: number = 1
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let k: any,
                start = true,
                index = 0,
                sync: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    const nextValue = (
                        wrap: boolean
                    ): Promise<IteratorResult<T>> => {
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
                            k = a.value?.[$S]?.();
                            if (!k) {
                                sync = false;
                                k = a.value?.[$A]?.();
                            }
                            if (!k) {
                                throw new TypeError(
                                    `Value at index ${index} is not iterable: ${JSON.stringify(
                                        a.value
                                    )}`
                                );
                            }
                            index++;
                            return nextValue(false);
                        });
                    }
                    return nextValue(true);
                },
            };
        },
    };
}
