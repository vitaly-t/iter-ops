import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Emits unique values, with optional key selector.
 */
export function distinct<T, K>(keySelector?: (value: T, index: number) => K): Operation<T, T> {
    return createOperation(distinctSync, distinctAsync, arguments);
}

function distinctSync<T, K>(iterable: Iterable<T>, keySelector?: (value: T, index: number) => K): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const ks = typeof keySelector === 'function' && keySelector;
            const keySet = new Set();
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a;
                    do {
                        a = i.next();
                        if (!a.done) {
                            const key = ks ? ks(a.value, index++) : a.value;
                            if (!keySet.has(key)) {
                                keySet.add(key);
                                return a;
                            }
                        }
                    } while (!a.done);
                    keySet.clear(); // for better memory management
                    return a;
                }
            };
        }
    };
}

function distinctAsync<T, K>(iterable: AsyncIterable<T>, keySelector?: (value: T, index: number) => K): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const ks = typeof keySelector === 'function' && keySelector;
            const keySet = new Set();
            let index = 0;
            return {
                async next(): Promise<IteratorResult<T>> {
                    let a;
                    do {
                        a = await i.next();
                        if (!a.done) {
                            const key = ks ? ks(a.value, index++) : a.value;
                            if (!keySet.has(key)) {
                                keySet.add(key);
                                return a;
                            }
                        }
                    } while (!a.done);
                    keySet.clear(); // for better memory management
                    return a;
                }
            };
        }
    };
}
