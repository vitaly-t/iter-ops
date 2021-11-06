/**
 * Pipe-through type.
 */
export interface Piper<T, R> {
    (i: Iterable<T>): Iterable<R>;
}

/**
 * Iterator-terminator (ends an iterator, with extreme prejudice).
 */
export interface Terminator<T, R> {
    (): { process: (i: Iterable<T>) => R };
}
