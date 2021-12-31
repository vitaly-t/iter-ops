import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Goes through the entire iterable, joining the values, and produces a one-value iterable with the join.
 *
 * ```ts
 * import {pipe, join} from 'iter-ops';
 *
 * const i = pipe(
 *     ['hello', 'world', '!'],
 *     join()
 * );
 *
 * console.log(...i); //=> 'helloworld!'
 *
 * console.log(i.first); //=> 'helloworld!'
 * ```
 *
 * When the optional separator is specified, it is used to separate values.
 *
 * ```ts
 * import {pipe, join} from 'iter-ops';
 *
 * const i = pipe(
 *     ['hello', 'world', '!'],
 *     join(' ')
 * );
 *
 * console.log(...i); //=> 'hello world !'
 *
 * console.log(i.first); //=> 'hello world !'
 * ```
 *
 * Note that the non-string values will be transformed into string so they can be joint.
 *
 * @category Sync+Async
 */
export function join<T>(separator?: string): Operation<T, string>;

export function join(...args: unknown[]) {
    return createOperation(joinSync, joinAsync, args);
}

function joinSync<T>(iterable: Iterable<T>, separator = ''): Iterable<string> {
    return {
        [$S](): Iterator<string> {
            const i = iterable[$S]();
            let value = '',
                first = true,
                finished = false;
            return {
                next(): IteratorResult<string> {
                    while (!finished) {
                        const a = i.next();
                        if (a.done) {
                            finished = true;
                            return {value, done: false};
                        }
                        if (!first) {
                            value += separator;
                        }
                        first = false;
                        value += String(a.value);
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    };
}

function joinAsync<T>(
    iterable: AsyncIterable<T>,
    separator = ''
): AsyncIterable<string> {
    return {
        [$A](): AsyncIterator<string> {
            const i = iterable[$A]();
            let value = '',
                first = true,
                finished = false;
            return {
                next(): Promise<IteratorResult<string>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            if (finished) {
                                return a;
                            }
                            finished = true;
                            return {value, done: false};
                        }

                        if (!first) {
                            value += separator;
                        }
                        first = false;
                        value += String(a.value);

                        return this.next();
                    });
                },
            };
        },
    };
}
