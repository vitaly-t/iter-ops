import {Operation} from './types';

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
