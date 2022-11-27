import {isIndexed} from './typeguards';
import {$A, $S, Operation} from './types';

/**
 * Wraps operator signature.
 */
export function createOperation<T, R>(
    syncFunc: (i: Iterable<T>, ...args: any[]) => Iterable<R>,
    asyncFunc: (i: AsyncIterable<T>, ...args: any[]) => AsyncIterable<R>,
    args?: Iterable<unknown>
): Operation<T, R> {
    return (i: any) => {
        const func: any = i[$S] ? syncFunc : asyncFunc;
        return args ? func.apply(null, [i, ...args]) : func(i);
    };
}

/**
 * Forward-through callback for synchronous pipelines.
 */
export function forwardThrough<T>(i: Iterable<T>): Iterable<T> {
    return i;
}

/**
 * Creates a generic synchronous operator that throws an error during iteration.
 */
export function throwOnSync<T>(operatorName: string) {
    return () => ({
        [$S](): Iterator<T> {
            return iterateOnce(true, () => {
                throw new Error(
                    `Operator "${operatorName}" requires asynchronous pipeline`
                );
            }) as Iterator<T>;
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
