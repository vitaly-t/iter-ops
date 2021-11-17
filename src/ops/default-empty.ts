import {Any, Piper} from '../types';

//import {pipe} from "../pipe";

/**
 * Adds default value|iterator|iterable to an empty iterable.
 */
export function defaultEmpty<T, D>(value: Iterable<D>): Piper<T, T | D>;
export function defaultEmpty<T, D>(value: Iterator<D>): Piper<T, T | D>;
export function defaultEmpty<T, D>(value: D): Piper<T, T | D>;

export function defaultEmpty<T, D>(value: Any<D>): Piper<T, T | D> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let k: Iterator<T>, v: any, start = true, empty = true, done = false;
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    if (!a.done) {
                        empty = false;
                        return a;
                    }
                    if (empty) {
                        if (start) {
                            v = value;
                            k = typeof v?.next === 'function' ? v : v?.[Symbol.iterator]?.();
                            start = false;
                        }
                        if (k) {
                            const b = k.next();
                            if (!b.done) {
                                return b;
                            }
                        }
                        if (!k && !done) {
                            done = true;
                            return {value: v};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    });
}

//[...pipe([], defaultEmpty(123))];
