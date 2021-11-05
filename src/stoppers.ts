/**
 * Stops an iterator when the callback returns a truthy value.
 */
export function stopWhen<T>(iterator: Iterator<T>, cb: (value: T, index: number) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const a = iterator.next();
                    if (a.done || cb(a.value, index++)) {
                        return {value: undefined, done: true};
                    }
                    return a;
                }
            };
        }
    };
}

/**
 * Stops an iterator, once the count is reached.
 */
export function stopOnCount<T>(iterator: Iterator<T>, count: number): Iterable<T> {
    return stopWhen(iterator, (value: T, index: number) => index >= count);
}

/**
 * Stops an iterator, upon exceeding a maximum value.
 */
export function stopOnValue<T>(iterator: Iterator<T>, maxValue: T): Iterable<T> {
    return stopWhen(iterator, (value: T) => value > maxValue);
}
