import type {TypeOfTag} from 'typescript';

import {$A, $S, UnknownIterator} from './types';

/**
 * Determines if the value is a non-null object.
 */
export function isObject<T>(value: T): value is T & object {
    return value !== null && typeof value === 'object';
}

/**
 * Determines if the given object has the given set property.
 */
export function has<T, K extends PropertyKey>(
    object: T,
    key: K
): object is T & Record<K, unknown> {
    // Cannot use `in` operator as it doesn't work for strings.
    return (object as any)[key] !== undefined;
}

/**
 * Determines if the given object has a function property with the given name.
 */
export function hasOfType<T, K extends PropertyKey>(
    object: T,
    key: K,
    type: 'function'
    // eslint-disable-next-line @typescript-eslint/ban-types -- `Function` is the best that we can determine here.
): object is T & Record<K, Function>;

export function hasOfType<T, K extends PropertyKey>(
    object: T,
    key: K,
    type: TypeOfTag
): object is T & Record<K, unknown> {
    return has(object, key) && typeof object[key] === type;
}

/**
 * Determines if the value is promise-like.
 */
export function isPromiseLike<T, CastGeneric = unknown>(
    value: T
): value is T & PromiseLike<CastGeneric> {
    return hasOfType(value, 'then', 'function');
}

/**
 * Determines if the value is an iterable.
 */
export function isSyncIterable<T, CastGeneric = unknown>(
    value: T
): value is T & Iterable<CastGeneric> {
    return hasOfType(value, $S, 'function');
}

/**
 * Determines if the value is an async iterable.
 */
export function isAsyncIterable<T, CastGeneric = unknown>(
    value: T
): value is T & AsyncIterable<CastGeneric> {
    return hasOfType(value, $A, 'function');
}

/**
 * Determines if the value is an iterator.
 *
 * Note: This function cannot distinguish between sync and async iterators.
 */
export function isUnknownIterator<T, CastGeneric = unknown>(
    value: T
): value is T & UnknownIterator<CastGeneric> {
    return hasOfType(value, 'next', 'function');
}

/**
 * Determines if the value is an iterator result.
 */
export function isIteratorResult<T, CastGeneric = unknown>(
    value: T
): value is T & IteratorResult<CastGeneric> {
    return has(value, 'value');
}
