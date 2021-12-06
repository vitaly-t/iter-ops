import {IterationState, Piper} from '../types';

/**
 * Standard filter logic for the iterable, extended for supporting iteration state.
 *
 * See also: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */

export function filter<T>(cb: (value: T, index: number, state: IterationState) => boolean): Piper<T, T> {
    return (iterable: Iterable<T> | AsyncIterable<T>) => {
        if ((iterable as any)[Symbol.iterator]) {
            return {
                [Symbol.iterator](): Iterator<T> {
                    const i = (iterable as Iterable<T>)[Symbol.iterator]();
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

        return {
            [Symbol.asyncIterator](): AsyncIterator<T> {
                const i = (iterable as AsyncIterable<T>)[Symbol.asyncIterator]();
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
    };
}
