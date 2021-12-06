import {Operation} from '../types';

/**
 * Produces an empty iterable.
 */
export function empty<T>(): Operation<T, T> {
    return null as any;/*
    return () => ({
        [Symbol.iterator]: () => ({next: () => ({value: undefined, done: true})})
    });*/
}
