type Piper<A, B = A> = (i: Iterable<A>) => Iterable<B>;
type Terminator<A, B = A> = () => { process: (i: Iterable<A>) => B };

function reduce<T, R = T>(cb: (previousValue: T, currentValue: T, index: number) => T, initialValue?: T): Terminator<T, R> {
    return () => ({
        process(iterator: Iterable<T>): R {
            let index = 0, prev = initialValue as any;
            for (const a of iterator) {
                prev = cb(prev, a, index++);
            }
            return prev;
        }
    })
}

function filter<T, R = T>(cb: (value: T, index: number) => boolean): Piper<T, R> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<R> {
            let index = 0, t = iterator[Symbol.iterator]();
            return {
                next(): IteratorResult<R> {
                    let a;
                    do {
                        a = t.next();
                        if (!a.done && cb(a.value, index++)) {
                            return {value: a.value as any};
                        }
                    } while (!a.done);
                    return {value: undefined, done: true};
                }
            };
        }
    });
}

function pipe<T, A = T>(i: Iterable<T>, p1: Piper<T, A>): Iterable<A>;
function pipe<T, A, B>(i: Iterable<T>, p1: Piper<T>, p2: Piper<T>): Iterable<T>;
function pipe<T, A = T, B = A, C = B>(i: Iterable<T>, p1: Piper<T, A>, p2: Piper<A, B>, p3: Piper<B, C>): Iterable<C>;

function pipe<T, A = T>(i: Iterable<T>, t: Terminator<T>): T;
function pipe<T, A = T, B = A>(i: Iterable<T>, p1: Piper<T, A>, t: Terminator<A, B>): B;
function pipe<T, A = T, B = A, C = B>(i: Iterable<T>, p1: Piper<T, A>, p2: Piper<A, B>, t: Terminator<B, C>): C;

function pipe<T, A = T>(i: Iterable<T>, ...pt: (Piper<T, A> | Terminator<T, A>)[]): Iterable<A> | A {
    let prev: any = i;
    for (const a of pt) {
        const res = a(prev) as any;
        if (res[Symbol.iterator]) {
            prev = res;
            continue;
        }
        return res.process(prev);
    }
    return prev;
}

(function test() {
    function* generateValues(): Iterable<number> {
        for (let i = 1; i < 10; i++) {
            yield i;
        }
    }

    const a = pipe(
        generateValues(),
        reduce((c, i) => c + i, 0)
    );

    const b = pipe(
        generateValues(),
        filter(f => f > 5),
        filter(f => f > 5),
        reduce((c, i) => c + i, 0)
    );

    const c = pipe(
        generateValues(),
        filter(a => a > 5),
        filter(a => a > 5),
        filter(b => b > 5) // TypeScript fails to deduce the type here :| Why?
    );

    console.log(a, b, [...c]);
})();
