/**
 * Pipe-through type.
 */
export type Piper<T, R = T> = (i: Iterable<T>) => Iterable<R>;

/**
 * Iterator-terminator (ends an iterator, with extreme prejudice).
 */
export type Terminator<T> = () => { process: (i: Iterable<T>) => T };
