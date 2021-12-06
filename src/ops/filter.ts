import {IterationState, Operation} from '../types';

function wrap1<T>(
    syncFunc: (i: Iterable<T>, ...a: any[]) => Iterable<T>,
    asyncFunc: (i: AsyncIterable<T>, ...a: any[]) => AsyncIterable<T>,
    args: IArguments): Operation<T, T> {
    return (i: Iterable<T> | AsyncIterable<T>) => {
        if ((i as any)[Symbol.iterator]) {
            return syncFunc.apply(null, [
                i as Iterable<T>,
                ...args
            ]) as any;
        }
        return asyncFunc.apply(null, [
            i as AsyncIterable<T>,
            ...args
        ]) as any;
    };
}

/*
function wrap2<T, R>(syncFunc: (...a: any[]) => Iterable<R>, asyncFunc: (...a: any[]) => AsyncIterable<R>, args: IArguments): Operation<T, R> {

}*/

/**
 * Standard filter logic for the iterable, extended for supporting iteration state.
 *
 * See also: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */
export function filter<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, T> {
    return wrap1(filterSync, filterAsync, arguments);

/*
    return (iterable: Iterable<T> | AsyncIterable<T>) => {
        if ((iterable as any)[Symbol.iterator]) {
            return filterSync(iterable as Iterable<T>, cb);
        }
        return filterAsync(iterable as AsyncIterable<T>, cb);
    };*/
}

function filterSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a;
                    do {
                        a = i.next();
                        if (!a.done && cb(a.value, index++, state)) {
                            return a;
                        }
                    } while (!a.done);
                    return a;
                }
            };
        }
    };
}

function filterAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                async next(): Promise<IteratorResult<T>> {
                    let a;
                    do {
                        a = await i.next();
                        if (!a.done && cb(a.value, index++, state)) {
                            return a;
                        }
                    } while (!a.done);
                    return a;
                }
            };
        }
    };
}
