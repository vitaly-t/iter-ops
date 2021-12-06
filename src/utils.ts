import {IterableExt, AsyncIterableExt, Operation} from './types';
import {catchError} from './ops/catch-error';

export function createOperation<T>(
    syncFunc: (i: Iterable<T>, ...args: any[]) => Iterable<T>,
    asyncFunc: (i: AsyncIterable<T>, ...args: any[]) => AsyncIterable<T>,
    args: IArguments): Operation<T, T> {
    return (i: Iterable<T> | AsyncIterable<T>) => {
        if ((i as any)[Symbol.iterator]) {
            return syncFunc.apply(null, [
                i as Iterable<T>,
                ...args
            ]);
        }
        return asyncFunc.apply(null, [
            i as AsyncIterable<T>,
            ...args
        ]) as any;
    };
}

/**
 * Extends an iterable object to IterableExt type.
 */
export function extendIterable(i: any): IterableExt<any> {
    Object.defineProperty(i, 'first', ({get: () => i[Symbol.iterator]().next().value}));
    i.catch = (cb: any) => extendIterable(catchError(cb)(i));
    return i;
}

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
                        return i < len ? {value: input[i++]} : {value: undefined, done: true};
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
