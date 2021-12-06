import {SyncAny, AsyncAny, SyncOperation, AsyncOperation} from '../types';
import {createOperation} from '../utils';

/**
 * Adds default value|iterator|iterable to an empty iterable.
 */
export function defaultEmpty<T, D>(value: Iterable<D>): SyncOperation<T, T | D>;
export function defaultEmpty<T, D>(value: Iterator<D>): SyncOperation<T, T | D>;
export function defaultEmpty<T, D>(value: D): SyncOperation<T, T | D>;

export function defaultEmpty<T, D>(value: AsyncIterable<D>): AsyncOperation<T, T | D>;
export function defaultEmpty<T, D>(value: AsyncIterator<D>): AsyncOperation<T, T | D>;
export function defaultEmpty<T, D>(value: Promise<D>): AsyncOperation<T, T | D>;

export function defaultEmpty<T, D>(value: SyncAny<D> | AsyncAny<D>): SyncOperation<T, T | D> | AsyncOperation<T, T | D> {
    return createOperation(defaultEmptySync, defaultEmptyAsync, arguments);
}

function defaultEmptySync<T, D>(iterable: Iterable<T>, value: SyncAny<D>): Iterable<T | D> {
    return {
        [Symbol.iterator](): Iterator<T | D> {
            const i = iterable[Symbol.iterator]();
            let k: Iterator<T>, v: any, start = true, empty = true, done = false;
            return {
                next(): IteratorResult<T> {
                    if (!done) {
                        const a = i.next();
                        if (!a.done) {
                            empty = false;
                            return a;
                        }
                        if (empty) {
                            if (start) {
                                v = value;
                                k = typeof v?.next === 'function' ? v : v?.[Symbol.iterator]?.();
                                start = false;
                            }
                            if (k) {
                                const b = k.next();
                                done = !!b.done;
                                return b;
                            }
                            done = true;
                            return {value: v};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function defaultEmptyAsync<T, D>(iterable: AsyncIterable<T>, value: AsyncAny<D>): AsyncIterable<T | D> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T | D> {
            const i = iterable[Symbol.asyncIterator]();
            let k: Iterator<T>, v: any, start = true, empty = true, done = false;
            return {
                async next(): Promise<IteratorResult<T>> {
                    if (!done) {
                        const a = await i.next();
                        if (!a.done) {
                            empty = false;
                            return a;
                        }
                        if (empty) {
                            if (start) {
                                v = value;
                                k = typeof v?.next === 'function' ? v : v?.[Symbol.iterator]?.();
                                start = false;
                            }
                            if (k) {
                                const b = k.next();
                                done = !!b.done;
                                return b;
                            }
                            done = true;
                            return {value: v};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}
