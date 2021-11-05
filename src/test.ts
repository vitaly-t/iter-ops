import {pipe} from "./pipe";
import {filter} from "./filter";
import {reduce} from "./reduce";
import {map} from "./map";

function* here(): Iterable<number> {
    for (let i = 1; i < 10; i++) {
        yield i;
    }
}

const b = pipe(
    here(),
    map(f => ({value: f})),
    //filter(f => f.value > 5),
    //filter(f => f.value > 7),
    // reduce((c, i) => ({value: c.value + i.value}), {value: 0})
    reduce((c, i) => c.value, {value: 0})
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
    // filter(b => b > 5), // fails to deduce the type :|
    map(a => a ** 2) // fails to deduce the type :|
);

console.log(b);
console.log(c);
console.log([...d]);
