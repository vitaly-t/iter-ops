export function map<T>(iterator: Iterator<T>, cb: (value: T, index: number) => T): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const a = iterator.next();
                    if (a.done) {
                        return {value: undefined, done: true};
                    }
                    return {value: cb(a.value, index++)};
                }
            };
        }
    };
}
