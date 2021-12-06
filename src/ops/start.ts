import {IterationState, Operation} from '../types';

/**
 * Starts emitting values, once the predicate returns a truthy value.
 */
export function start<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, T> {
    return null as any;/*
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0, done = false;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!done) {
                        while (!a.done && !cb(a.value, index++, state)) {
                            a = i.next();
                        }
                        done = true;
                    }
                    return a;
                }
            };
        }
    });*/
}
