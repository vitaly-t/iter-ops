import {Any, AnySync, AnyIterable, AnyIterator, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Adds default value|iterator|iterable to an empty iterable.
 *
 * @category Sync+Async
 */
export function defaultEmpty<T, D>(value: AnyIterable<D>): Operation<T, T | D>;
export function defaultEmpty<T, D>(value: AnyIterator<D>): Operation<T, T | D>;
export function defaultEmpty<T, D>(value: D): Operation<T, T | D>;

export function defaultEmpty<T, D>(value: Any<D>): Operation<T, T | D> {
    return createOperation(defaultEmptySync, defaultEmptyAsync, arguments);
}

function defaultEmptySync<T, D>(iterable: Iterable<T>, value: AnySync<D>): Iterable<T | D> {
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
                            return {value: v, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function defaultEmptyAsync<T, D>(iterable: AsyncIterable<T>, value: Any<D>): AsyncIterable<T | D> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T | D> {
            const i = iterable[Symbol.asyncIterator]();
            let k: AsyncIterator<T>, v: any, start = true, empty = true, done = false;
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
                                k = typeof v?.next === 'function' ? v : (v?.[Symbol.iterator]?.() || v?.[Symbol.asyncIterator]?.());
                                start = false;
                            }
                            if (k) {
                                const b = await k.next();
                                done = !!b.done;
                                return b;
                            }
                            done = true;
                            return {value: v, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}
