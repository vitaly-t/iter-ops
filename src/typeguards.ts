import type {TypeOfTag} from 'typescript';

import {$A, $S, TypedArray, UnknownIterator} from './types';

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
    return key in Object(object);
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

/**
 * Determines if the given object has a property with the given name of type number.
 */
export function hasOfType<T, K extends PropertyKey>(
    object: T,
    key: K,
    type: 'number'
): object is T & Record<K, number>;

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
    return has(value, 'value') || (has(value, 'done') && value.done === true);
}

/**
 * Determines if the value is an indexed type.
 */
export function isIndexed<T, CastGeneric = unknown>(
    value: T
): value is T & ArrayLike<CastGeneric> {
    return (
        Array.isArray(value) ||
        isTypedArray(value) ||
        typeof value === 'string' ||
        value instanceof String
    );
}

/**
 * Determines if the value is a typed array.
 */
export function isTypedArray<T>(value: T): value is T & TypedArray {
    return (
        has(value, 'BYTES_PER_ELEMENT') &&
        has(value, 'buffer') &&
        isArrayBufferLike(value.buffer)
    );
}

/**
 * Determines if the value is a buffer-like array.
 */
export function isArrayBufferLike<T>(value: T): value is T & ArrayBufferLike {
    return hasOfType(value, 'byteLength', 'number');
}
