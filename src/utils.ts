/**
 * Type-based performance optimizer.
 *
 * Tests show that for indexed types, JavaScript performs way better
 * when accessed via index, rather than iterable interface.
 */
export function wrapIterable<T>(input: any): any {
    if (isIndexed(input)) {
        // wrap the input, to use index internally;
        return {
            [Symbol.iterator](): Iterator<T> {
                const len = input.length;
                let i = 0;
                return {
                    next(): IteratorResult<T> {
                        return i < len ? {value: input[i++]} : {value: undefined, done: true};
                    }
                };
            }
        };
    }
    return input;
}

/**
 * Checks for indexed types.
 */
function isIndexed(input: any): boolean {
    return Array.isArray(input) ||
        (input?.buffer instanceof ArrayBuffer && input.BYTES_PER_ELEMENT) || // Buffer or Typed Array
        typeof input === 'string' ||
        input instanceof String;
}
