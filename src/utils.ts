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

/**+
 * Creates a generic a synchronous operator that throws an error.
 */
export function throwOnSync<T>(operatorName: string) {
    return () => ({
        [Symbol.iterator]() {
            return {
                next() {
                    throw new Error(`Operator "${operatorName}" requires asynchronous pipeline`);
                }
            };
        }
    });
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
    if (isIndexed(input)) {
        // wrap the input, to use index internally;
        return {
            [Symbol.iterator](): Iterator<any> {
                const len = input.length;
                let i = 0;
                return {
                    next(): IteratorResult<any> {
                        return i < len ? {value: input[i++], done: false} : {value: undefined, done: true};
                    }
                };
            }
        };
    }
    return input;
}

/**
 * Checks for indexed types.
 */
function isIndexed(input: any): boolean {
    return Array.isArray(input) ||
        (input?.buffer instanceof ArrayBuffer && input.BYTES_PER_ELEMENT) || // Buffer or Typed Array
        typeof input === 'string' ||
        input instanceof String;
}
