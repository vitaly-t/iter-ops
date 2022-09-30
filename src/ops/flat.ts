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
 *     flat()
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
): Operation<Iterable<T | Iterable<T>> | AsyncIterable<T>, T>;

export function flat(...args: unknown[]) {
    return createOperation(flatSync, flatAsync, args);
}

function flatSync<T>(
    iterable: Iterable<Iterable<T>>,
    depth: number = 1
): Iterable<T | Iterable<T>> {
    return {
        [$S](): Iterator<T | Iterable<T>> {
            const d: Iterator<T | Iterable<T>>[] = new Array(depth + 1);
            d[0] = iterable[$S]();
            let level = 0;
            return {
                next(): IteratorResult<T | Iterable<T>> {
                    do {
                        const i = d[level].next();
                        if (i.done) {
                            if (!level) {
                                return i;
                            }
                            level--;
                            continue;
                        }
                        if (level === depth) {
                            return i; // maximum depth reached
                        }
                        const k = (i.value as Iterable<T>)?.[$S]?.();
                        if (!k) {
                            return i;
                        }
                        d[++level] = k;
                    } while (true);
                },
            };
        },
    };
}

function flatAsync<T>(
    iterable: AsyncIterable<Iterable<T> | AsyncIterable<T>>,
    depth: number = 1
): AsyncIterable<T | Iterable<T>> {
    type AnyValue = T | Iterator<T> | AsyncIterator<T>;
    return {
        [$A](): AsyncIterator<T> {
            const d: { i: any, sync: boolean }[] = new Array(depth + 1);
            d[0] = {i: iterable[$A](), sync: false};
            let level = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    const i = d[level].i.next();
                    if (d[level].sync) {
                        if (i.done) {
                            level--;
                            return this.next();
                        }
                        if (level === depth) {
                            return Promise.resolve(i); // maximum depth reached
                        }
                        let k: AnyValue = i.value?.[$S]?.();
                        let sync = true;
                        if (!k) {
                            k = i.value?.[$A]?.();
                            if (!k) {
                                return Promise.resolve(i);
                            }
                            sync = false;
                        }
                        d[++level] = {i: k, sync};
                        return this.next();
                    }
                    return i.then((a: IteratorResult<T | Iterable<T> | AsyncIterable<T>>) => {
                        if (a.done) {
                            if (!level) {
                                return a;
                            }
                            level--;
                            return this.next();
                        }
                        if (level === depth) {
                            return a; // maximum depth reached
                        }
                        let k: AnyValue = (a.value as AsyncIterable<T>)?.[$A]?.();
                        let sync = false;
                        if (!k) {
                            k = (a.value as Iterable<T>)?.[$S]?.();
                            if (!k) {
                                return a;
                            }
                            sync = true;
                        }
                        d[++level] = {i: k, sync};
                        return this.next();
                    });
                }
            };
        },
    };
}
