import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {spread as spreadAsync} from './async';
import {spread as spreadSync} from './sync';

/**
 * Spreads / expands iterable values.
 *
 * The source is expected to emit iterable values only, or else it will throw an error.
 *
 * ```ts
 * import {pipe, spread} from 'iter-ops';
 *
 * const i = pipe(
 *     ['first', 'second'],
 *     spread()
 * );
 *
 * console.log(...i); //=> 'f', 'i', 'r', 's', 't', 's', 'e', 'c', 'o', 'n', 'd'
 * ```
 *
 * It implements the logic consistent with JavaScript's native spread operator, whereby it expands
 * elements on the top level only, and it will throw an error when passed in a non-iterable value.
 *
 * If you want values expanded recursively, and without throwing errors, see operator {@link flat}.
 *
 * @throws `TypeError: 'Value at index X is not iterable: ...'` when a non-iterable value encountered.
 *
 * @see
 *  - {@link flat}
 * @category Sync+Async
 */
export function spread<
    T extends Iterable<unknown> | AsyncIterable<unknown>
>(): DuelOperation<
    T,
    T extends Iterable<infer E> | AsyncIterable<infer E> ? E : never
> {
    return createDuelOperation<
        T,
        T extends Iterable<infer E> | AsyncIterable<infer E> ? E : never
    >(spreadSync as any, spreadAsync);
}
