import {pipe} from "./pipe";
import {filter} from "./filter";
import {reduce} from "./reduce";
import {map} from "./map";
import {stop} from "./stop";

function* here(): Iterable<number> {
    for (let i = 1; i < 10; i++) {
        yield i;
    }
}

const data:number[] = [111, 2, 3, 4, 5, 6, 7, 8, 9];

const b = pipe(
    here(),
    map(f => ({value: f})),
    filter(f => f.value > 5),
    // filter(f => f.value > 7),
    // reduce((c, i) => ({value: c.value + i.value}), {value: 0})
    reduce((c, i) => c.value + i.value)
);

const c = pipe(
    data,
    filter(f => f <= 5),
    reduce((c, i) => c + i),
    // map(a => ({value: a})),
    // reduce((c, i) => c + i, 0)
);

const d = pipe(
    here(),
    filter(a => a > 5), // fails to deduce the type :|
    filter(b => b > 5), // fails to deduce the type :|
    // filter(b => b > 5), // fails to deduce the type :|
    map(a => a ** 2) // fails to deduce the type :|
);

console.log(b);
console.log([...c]);
console.log([...d]);
