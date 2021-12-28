import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Starts emitting values after `count` number of values.
 *
 * @category Sync+Async
 */
export function skip<T>(count: number): Operation<T, T>;

export function skip(...args: unknown[]) {
    return createOperation(skipSync, skipAsync, args);
}

function skipSync<T>(iterable: Iterable<T>, count: number): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            let index = 0,
                finished = false;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!finished) {
                        while (!a.done && index++ < count) {
                            a = i.next();
                        }
                        finished = true;
                    }
                    return a;
                },
            };
        },
    };
}

function skipAsync<T>(
    iterable: AsyncIterable<T>,
    count: number
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let index = 0,
                finished = false;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (!finished) {
                            finished = a.done || index++ >= count;
                        }
                        return finished ? a : this.next();
                    });
                },
            };
        },
    };
}
