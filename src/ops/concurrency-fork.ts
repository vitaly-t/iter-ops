import type {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Provides a work chain based on concurrency, for operator {@link concurrencyFork}.
 */
interface IConcurrencyWork<T, R> {
    onSync?(i: Iterable<T>): Iterable<R> | null | undefined;

    onAsync?(i: AsyncIterable<T>): AsyncIterable<R> | null | undefined;
}

/**
 * @category Sync+Async
 */
export function concurrencyFork<T, R>(
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
