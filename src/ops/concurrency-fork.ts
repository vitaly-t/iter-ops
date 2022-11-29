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
 * It is a helper for custom operators, to provide separate operator chains.
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
