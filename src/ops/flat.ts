import {
    $A,
    $S,
    type Decrement,
    type Operation,
    type UnknownIterable
} from '../types';
import {createOperation} from '../utils';

/**
 * @internal
 */
export type Flatten<T, N extends number> =
    // N < 0
    `${N}` extends `-${string}`
        ? T
        : // N = 0
          N extends 0
          ? T
          : // N = 1
            N extends 1
            ? T extends UnknownIterable<infer E>
                ? E
                : T
            : // N > 20 or N is unknown
              Decrement[number] extends Decrement[N]
              ? unknown
              : T extends UnknownIterable<infer E>
                ? Flatten<E, Decrement[N]>
                : Flatten<T, Decrement[N]>;

/**
 * Expands / flattens sub-iterables up to the specified `depth` (default is 1), with support for `skip` logic.
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
 * It implements the logic similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.flat},
 * handling non-iterable values without throwing errors (unlike {@link spread}), and with optional `depth` support.
 * However, unlike `Array.flat`, this operator expands all iterable values, including strings.
 * If you want to prevent certain values from being expanded, you can pass in second parameter -
 * `skip(value, level)` callback function:
 *
 * ```ts
 * const i = pipe(
 *     ['one', [1, 2, 3]],
 *     flat(1, v => typeof v === 'string') // skip expanding strings
 * );
 *
 * console.log(...i); //=> 'one', 1, 2, 3
 * ```
 * Parameter `level` in the `skip` callback represents current depth level = `0, ...depth - 1`
 *
 * Note that when handling a synchronous iterable, this operator can only expand synchronous sub-iterables.
 * But when handling an asynchronous iterable, it can expand mixed sub-iterables, i.e. any combination of
 * synchronous and asynchronous sub-iterables.
 *
 * Compare it to a more strict {@link spread} operator.
 *
 * @see
 *  - {@link spread}
 *  - {@link flatMap}
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.flat}
 * @category Sync+Async
 */
export function flat<T, N extends number = 1>(
    depth?: N,
    skip?: (value: any, level: number) => boolean
): Operation<T, Flatten<T, N>>;

export function flat(...args: unknown[]) {
    return createOperation(flatSync, flatAsync, args);
}

function flatSync<T>(
    iterable: Iterable<Iterable<T>>,
    depth = 1,
    skip?: (value: any, level: number) => false
): Iterable<T | Iterable<T>> {
    return {
        [$S](): Iterator<T | Iterable<T>> {
            const d: Iterator<T | Iterable<T>>[] = new Array(depth + 1);
            d[0] = iterable[$S]();
            let level = 0;
            return {
                next(): IteratorResult<T | Iterable<T>> {
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
                        if (
                            !i ||
                            (typeof skip === 'function' && skip(v.value, level))
                        ) {
                            return v; // non-iterable value or to be skipped
                        }
                        d[++level] = i; // save next iterable
                    } while (true);
                }
            };
        }
    };
}

function flatAsync<T>(
    iterable: AsyncIterable<Iterable<T> | AsyncIterable<T>>,
    depth = 1,
    skip?: (value: any, level: number) => false
): AsyncIterable<T | Iterable<T> | AsyncIterable<T>> {
    type AnyValue = T | Iterator<T> | AsyncIterator<T>;
    return {
        [$A](): AsyncIterator<T> {
            const d: {i: any; sync: boolean}[] = new Array(depth + 1);
            d[0] = {i: iterable[$A](), sync: false};
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
                            if (
                                !i ||
                                (typeof skip === 'function' &&
                                    skip(v.value, level))
                            ) {
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
                                if (
                                    !i ||
                                    (typeof skip === 'function' &&
                                        skip(a.value, level))
                                ) {
                                    return a; // non-iterable value
                                }
                                sync = true;
                            }
                            d[++level] = {i, sync}; // save next iterable
                            return this.next();
                        }
                    );
                }
            };
        }
    };
}
