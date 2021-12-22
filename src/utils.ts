import {IterableExt, AsyncIterableExt, Operation} from './types';
import {catchError} from './ops/catch-error';

/**
 * Wraps operator signature.
 */
export function createOperation<T, R>(
    syncFunc: (i: Iterable<T>, ...args: any[]) => Iterable<R>,
    asyncFunc: (i: AsyncIterable<T>, ...args: any[]) => AsyncIterable<R>,
    args?: IArguments): Operation<T, T> {
    return (i: any) => {
        const func: any = i[Symbol.iterator] ? syncFunc : asyncFunc;
        return func.apply(null, [i, ...args || []]);
    };
}

/**
 * Creates a generic synchronous operator that throws an error during iteration.
 */
export function throwOnSync<T>(operatorName: string) {
    return () => ({
        [Symbol.iterator](): Iterator<T> {
            return iterateOnce(true, () => {
                throw new Error(`Operator "${operatorName}" requires asynchronous pipeline`);
            }) as Iterator<T>;
        }
    });
}

/**
 * Creates a once-off iterator with a callback.
 * It is to help throwing errors when the iteration starts.
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
        }
    };
}

/**
 * Extends an Iterable object into IterableExt type.
 */
export function extendIterable(i: any): IterableExt<any> {
    Object.defineProperty(i, 'first', ({get: () => i[Symbol.iterator]().next().value}));
    i.catch = (cb: any) => extendIterable(catchError(cb)(i));
    return i;
}

/**
 * Extends an AsyncIterable object into AsyncIterableExt type.
 */
export function extendAsyncIterable(i: any): AsyncIterableExt<any> {
    Object.defineProperty(i, 'first', ({get: () => i[Symbol.asyncIterator]().next().then((a: any) => a.value)}));
    i.catch = (cb: any) => extendAsyncIterable(catchError(cb)(i));
    return i;
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
export function indexedIterable<T>(input: any): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const len = input.length;
            let i = 0;
            return {
                next(): IteratorResult<T> {
                    return i < len ? {value: input[i++], done: false} : {value: undefined, done: true};
                }
            };
        }
    };
}

/**
 * Wraps an indexed iterable into an AsyncIterable<T> object
 */
export function indexedAsyncIterable<T>(input: any): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const len = input.length;
            let i = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return Promise.resolve(i < len ? {value: input[i++], done: false} : {value: undefined, done: true});
                }
            };
        }
    };
}

/**
 * Checks for indexed types.
 */
export function isIndexed(input: any): boolean {
    return Array.isArray(input) ||
        (input?.buffer instanceof ArrayBuffer && input.BYTES_PER_ELEMENT) || // Buffer or Typed Array
        typeof input === 'string' ||
        input instanceof String;
}

/**
 * Verifies if value is a promise.
 */
export function isPromise(a: any): boolean {
    return a && typeof a.then === 'function';
}
