import {isAsyncIterable, isSyncIterable} from '../typeguards';
import {
    $A,
    $S,
    AsyncIterableOrIterator,
    Decr,
    IterableOrIterator,
    Operation,
    UnknownIterableOrIterator,
} from '../types';
import {createOperation} from '../utils';

type Flatten<T, N extends number> =
    // N < 0
    `${N}` extends `-${string}`
        ? T
        : // N = 0
        N extends 0
        ? T
        : // N = 1
        N extends 1
        ? T extends UnknownIterableOrIterator<infer E>
            ? E
            : T
        : // N > 20 or N is unknown
        Decr[number] extends Decr[N]
        ? unknown
        : T extends UnknownIterableOrIterator<infer E>
        ? Flatten<E, Decr[N]>
        : Flatten<T, Decr[N]>;

/**
 * **New in v2.0.0**
 *
 * Expands / flattens sub-iterables up to the specified `depth` (default is 1).
 *
 * ```ts
 * import {pipe, flat} from 'iter-ops';
 *
 * const i = pipe(
 *     ['one', [2, 3, [4, 5]]],
 *     flat(2)
 * );
 *
 * console.log(...i); //=> 'o', 'n', 'e', 2, 3, 4, 5
 * ```
 *
 * It implements the logic consistent with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.prototype.flat()},
 * handling non-iterable values without throwing errors (unlike {@link spread}), and with optional `depth` support.
 *
 * Note that when handling a synchronous iterable, this operator can only expand synchronous sub-iterables.
 * But when handling an asynchronous iterable, it can expand mixed sub-iterables, i.e. any combination of
 * synchronous and asynchronous sub-iterables.
 *
 * Compare it to a more strict {@link spread} operator.
 *
 * @see
 *  - {@link spread}
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.prototype.flat()}
 * @category Sync+Async
 */
export function flat<T, N extends number = 1>(
    depth?: N
): Operation<T, Flatten<T, N>>;

export function flat(...args: unknown[]) {
    return createOperation(flatSync, flatAsync, args);
}

function flatSync<T>(
    iter: IterableOrIterator<IterableOrIterator<T>>,
    depth = 1
): Iterable<T | IterableOrIterator<T>> {
    return {
        [$S](): Iterator<T | IterableOrIterator<T>> {
            const d: Iterator<T | IterableOrIterator<T>>[] = new Array(
                depth + 1
            );
            d[0] = isSyncIterable<typeof iter, IterableOrIterator<T>>(iter)
                ? iter[$S]()
                : iter;
            let level = 0;
            return {
                next(): IteratorResult<T | IterableOrIterator<T>> {
                    do {
                        const v = d[level].next(); // next value
                        if (v.done) {
                            if (!level) {
                                return v; // we are finished
                            }
                            level--; // back to upper level
                            continue;
                        }
                        if (level === depth) {
                            return v; // maximum depth reached
                        }
                        const i = (v.value as Iterable<T>)?.[$S]?.();
                        if (!i) {
                            return v; // non-iterable value
                        }
                        d[++level] = i; // save next iterable
                    } while (true);
                },
            };
        },
    };
}

function flatAsync<T>(
    iter: AsyncIterableOrIterator<
        IterableOrIterator<T> | AsyncIterableOrIterator<T>
    >,
    depth = 1
): AsyncIterable<
    T | Iterable<T> | Iterator<T> | AsyncIterable<T> | AsyncIterator<T>
> {
    type AnyValue =
        | T
        | Iterable<T>
        | Iterator<T>
        | AsyncIterable<T>
        | AsyncIterator<T>;
    return {
        [$A](): AsyncIterator<T> {
            const d: {i: any; sync: boolean}[] = new Array(depth + 1);
            d[0] = {
                i: isAsyncIterable<typeof iter, IterableOrIterator<T>>(iter)
                    ? iter[$A]()
                    : iter,
                sync: false,
            };
            let level = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    const v = d[level].i.next(); // next value
                    if (d[level].sync) {
                        if (v.done) {
                            level--; // back to upper level
                            return this.next();
                        }
                        if (level === depth) {
                            return Promise.resolve(v); // maximum depth reached
                        }
                        let i: AnyValue = v.value?.[$S]?.(); // first try with sync
                        let sync = true;
                        if (!i) {
                            i = v.value?.[$A]?.(); // then try with async
                            if (!i) {
                                return Promise.resolve(v); // non-iterable value
                            }
                            sync = false;
                        }
                        d[++level] = {i, sync}; // save next iterable
                        return this.next();
                    }
                    return v.then(
                        (
                            a: IteratorResult<
                                T | Iterable<T> | AsyncIterable<T>
                            >
                        ) => {
                            if (a.done) {
                                if (!level) {
                                    return a; // we are finished
                                }
                                level--; // back to upper level
                                return this.next();
                            }
                            if (level === depth) {
                                return a; // maximum depth reached
                            }
                            let i: AnyValue = (a.value as AsyncIterable<T>)?.[
                                $A
                            ]?.(); // first, try with async
                            let sync = false;
                            if (!i) {
                                i = (a.value as Iterable<T>)?.[$S]?.(); // then try with sync
                                if (!i) {
                                    return a; // non-iterable value
                                }
                                sync = true;
                            }
                            d[++level] = {i, sync}; // save next iterable
                            return this.next();
                        }
                    );
                },
            };
        },
    };
}
