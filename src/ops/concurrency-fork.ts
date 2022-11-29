import type {Operation} from '../types';
import {createOperation} from '../utils';

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
 * It is a coding-style helper for custom operators with implementation dependent on concurrency.
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
 * This operator is strictly about coding style, it is not necessary, and can be simply replaced with
 * a check on the source iterable:
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
 * The choice is down to your coding-style preference. Operator `concurrencyFork` adds more strict types control,
 * plus automatic forwarding to the source when there is no handler or nothing is returned.
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
    return work.onSync?.(iterable) ?? (iterable as Iterable<any>);
}

function concurrencyForkAsync<T, R>(
    iterable: AsyncIterable<T>,
    work: IConcurrencyWork<T, R>
): AsyncIterable<R> {
    return work.onAsync?.(iterable) ?? (iterable as AsyncIterable<any>);
}
