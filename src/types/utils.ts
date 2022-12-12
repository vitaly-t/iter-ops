import type {UnknownIterable} from './common';

/**
 * @internal
 */
export type FlattenAsync<T, N extends number> =
    // N < 0
    `${N}` extends `-${string}`
        ? T
        : // N = 0
        N extends 0
        ? T
        : // N = 1
        N extends 1
        ? T extends UnknownIterable<infer E>
            ? E
            : T
        : // N > 20 or N is unknown
        Decrement[number] extends Decrement[N]
        ? unknown
        : T extends UnknownIterable<infer E>
        ? FlattenAsync<E, Decrement[N]>
        : FlattenAsync<T, Decrement[N]>;

/**
 * @internal
 */
export type FlattenSync<T, N extends number> =
    // N < 0
    `${N}` extends `-${string}`
        ? T
        : // N = 0
        N extends 0
        ? T
        : // N = 1
        N extends 1
        ? T extends Iterable<infer E>
            ? E
            : T
        : // N > 20 or N is unknown
        Decrement[number] extends Decrement[N]
        ? unknown
        : T extends Iterable<infer E>
        ? FlattenSync<E, Decrement[N]>
        : FlattenSync<T, Decrement[N]>;

/**
 * Decrement N by 1.
 *
 * `Decr[N]` => `N - 1`
 */
type Decrement = [
    never,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20
];
