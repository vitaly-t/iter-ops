import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * **New in v2.0.0**
 *
 * Ends iteration after a specified number of milliseconds (from the beginning of iteration).
 *
 * @category Sync+Async
 */
export function timeout<T>(ms: number): Operation<T, T>;

export function timeout(...args: unknown[]) {
    return createOperation(timeoutSync, timeoutAsync, args);
}

function timeoutSync<T>(iterable: Iterable<T>, ms: number): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            let start: number;
            return {
                next(): IteratorResult<T> {
                    const now = Date.now();
                    start = start || now;
                    if (now - start > ms) {
                        return {value: undefined, done: true};
                    }
                    return i.next();
                },
            };
        },
    };
}

function timeoutAsync<T>(
    iterable: AsyncIterable<T>,
    ms: number
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let start: number;
            return {
                next(): Promise<IteratorResult<T>> {
                    const now = Date.now();
                    start = start || now;
                    if (now - start > ms) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    return i.next();
                },
            };
        },
    };
}
