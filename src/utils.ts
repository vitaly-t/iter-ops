import {isIndexed} from './typeguards';
import {
    $A,
    $S,
    AsyncOperation,
    DuelOperation,
    SyncOperation,
    UnknownIterable,
} from './types';

export function createDuelOperation<T, R>(
    syncOp: (...args: readonly any[]) => SyncOperation<T, R>,
    asyncOp: (...args: readonly any[]) => AsyncOperation<T, R>,
    args: readonly unknown[] = []
): DuelOperation<T, R> {
    return (i: UnknownIterable<T>) => {
        const op = (i as any)[$S] ? syncOp : asyncOp;
        return op(...args)(i as any);
    };
}

/**
 * Creates a generic synchronous operator that throws an error during iteration.
 */
export function throwOnSync<T>(
    operatorName: string
): () => SyncOperation<T, never> {
    return () => () => ({
        [$S](): Iterator<never> {
            return iterateOnce(true, () => {
                throw new Error(
                    `Operator "${operatorName}" requires asynchronous pipeline`
                );
            }) as Iterator<never>;
        },
    });
}

/**
 * Creates a once-off iterator with a callback.
 * It is to help to throw errors when the iteration starts.
 */
export function iterateOnce(sync: boolean, cb: () => void) {
    const value = undefined;
    let done = false;
    return {
        next() {
            if (!done) {
                done = true;
                cb();
            }
            return sync ? {value, done} : Promise.resolve({value, done});
        },
    };
}

/**
 * Type-dependent performance optimizer.
 *
 * Tests show that for indexed types, JavaScript performs way better
 * when accessed via index, rather than iterable interface.
 */
export function optimizeIterable(input: any): Iterable<any> {
    return isIndexed(input) ? indexedIterable(input) : input;
}

/**
 * Wraps an indexed iterable into an Iterable<T> object
 */
export function indexedIterable<T>(input: ArrayLike<T>): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const len = input.length;
            let i = 0;
            return {
                next(): IteratorResult<T> {
                    return i < len
                        ? {value: input[i++], done: false}
                        : {value: undefined, done: true};
                },
            };
        },
    };
}

/**
 * Wraps an indexed iterable into an AsyncIterable<T> object
 */
export function indexedAsyncIterable<T>(input: any): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const len = input.length;
            let i = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return Promise.resolve(
                        i < len
                            ? {value: input[i++], done: false}
                            : {value: undefined, done: true}
                    );
                },
            };
        },
    };
}
