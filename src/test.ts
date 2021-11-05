import {pipe} from "./pipe";
import {filter} from "./filter";
import {reduce} from "./reduce";

function* here(): Iterable<number> {
    for (let i = 1; i < 10; i++) {
        yield i;
    }
}

const b = pipe(
    here(),
    filter(f => f > 5),
    filter(f => f > 5),
    filter(f => f > 5),
    reduce((c, i) => c + i, 0)
);

const c = pipe(
    here(),
    // filter(f => f > 5),
    reduce((c, i) => c + i, 0)
);

const d = pipe(
    here(),
    filter(a => a > 5), // fails to deduce the type :|
    filter(b => b > 5), // fails to deduce the type :|
    filter(b => b > 5), // fails to deduce the type :|
    filter(b => b > 5) // fails to deduce the type :|
);

console.log(b);
console.log(c);
console.log([...d]);
