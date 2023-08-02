import type {Operation} from '../types';
import {createOperation} from '../utils';
import {$A, $S} from '../types';

/**
 * Provides a work chain, based on concurrency, for operator {@link concurrencyFork}.
 */
export interface IConcurrencyWork<T, R> {
    /**
     * Invoked for synchronous iterables only, to return a chain of operators for synchronous processing.
     *
     * When nothing or `null` is returned, it redirects to the source iterable.
     */
    onSync?(i: Iterable<T>): Iterable<R> | null | void;

    /**
     * Invoked for asynchronous iterables only, to return a chain of operators for asynchronous processing.
     *
     * When nothing or `null` is returned, it redirects to the source iterable.
     */
    onAsync?(i: AsyncIterable<T>): AsyncIterable<R> | null | void;
}

/**
 * Splits synchronous from asynchronous operator chains, based on concurrency.
 *
 * It is a helper for custom operators with implementation dependent on concurrency.
 *
 * ```ts
 * import {concurrencyFork} from 'iter-ops';
 *
 * function myOperator<T>() {
 *     return source => concurrencyFork({
 *         onSync(i: Iterable<T>) {
 *             // "i" and "source" are the same object here, with different type cast
 *
 *             // return a synchronous operator chain
 *         },
 *         onAsync(i: AsyncIterable<T>) {
 *             // "i" and "source" are the same object here, with different type cast
 *
 *             // return an asynchronous operator chain
 *         }
 *     })(source);
 * }
 * ```
 *
 * Returning from the callback any of the following is the same as not having the handler at all,
 * which will just forward to the source iterable (so it will have no effect):
 *  - `return i`
 *  - `return source`
 *  - `return null`
 *  - `return undefined` (or do nothing)
 *
 * This operator is not strictly necessary, since a custom operator can simply check the type directly:
 *
 * ```ts
 * function myOperator<T>() {
 *     return source => {
 *         const sync = typeof source[Symbol.iterator] === 'function';
 *         if(sync) {
 *             // return a synchronous operator chain
 *         }
 *         // else:
 *         // return an asynchronous operator chain
 *     };
 * }
 * ```
 *
 * However, use of operator `concurrencyFork` offers the following advantages:
 *  - It handles errors that a custom operator may throw during pipeline construction,
 *    and turns them into iteration-time errors, so operator {@link catchError} can handle them.
 *  - It will safely redirect to the source, should your custom operator not provide a handler,
 *    or when the handler doesn't return anything.
 *  - It offers a more strict types control, plus generally cleaner coding style.
 *
 * @category Sync+Async
 */
export function concurrencyFork<T, R = T>(
    work: IConcurrencyWork<T, R>
): Operation<T, R>;

export function concurrencyFork(...args: unknown[]) {
    return createOperation(concurrencyForkSync, concurrencyForkAsync, args);
}

function concurrencyForkSync<T, R>(
    iterable: Iterable<T>,
    work: IConcurrencyWork<T, R>
): Iterable<R> {
    try {
        const i = typeof work.onSync === 'function' && work.onSync(iterable);
        return i || (iterable as Iterable<any>);
    } catch (err) {
        return {
            [$S](): Iterator<R> {
                let done = false;
                return {
                    next(): IteratorResult<R> {
                        if (done) {
                            return {value: undefined, done};
                        }
                        done = true;
                        throw err; // now catchError operator can handle the error
                    }
                };
            }
        };
    }
}

function concurrencyForkAsync<T, R>(
    iterable: AsyncIterable<T>,
    work: IConcurrencyWork<T, R>
): AsyncIterable<R> {
    try {
        const i = typeof work.onAsync === 'function' && work.onAsync(iterable);
        return i || (iterable as AsyncIterable<any>);
    } catch (err) {
        return {
            [$A](): AsyncIterator<R> {
                let done = false;
                return {
                    next(): Promise<IteratorResult<R>> {
                        if (done) {
                            return Promise.resolve({value: undefined, done});
                        }
                        done = true;
                        return Promise.reject(err); // now catchError operator can handle the error
                    }
                };
            }
        };
    }
}
