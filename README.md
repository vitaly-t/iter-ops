## iter-ops

-   [About](#about)
-   [Installation](#installation)
-   [Usage](#usage)
-   [API]

## About

Basic operations on [synchronous] + [asynchronous] iterables, strictly for JavaScript native types.

![image](https://user-images.githubusercontent.com/5108906/147329472-38caa349-1baa-4ab0-945e-5cf618ce0dd9.png)

We do not use any synthetic types / wrappers here, like `Observable` in RXJS, etc. It is strictly an iterable on the
input, and an iterable on the output, for maximum performance, simplicity and compatibility (see [Rationale]).

## Installation

```
$ npm i iter-ops
```

## Usage

-   Synchronous pipeline:

```ts
import {pipe, filter, map} from 'iter-ops';

const input = [1, 2, 3, 4, 5];

const i = pipe(
    input,
    filter((a) => a % 2 === 0), // find even numbers
    map((value) => ({value})) // remap into objects
);

console.log(...i); //=> {value: 2}, {value: 4}
```

-   Asynchronous pipeline:

```ts
import {pipe, toAsync, distinct, delay} from 'iter-ops';

const input = [1, 2, 2, 3, 3, 4];

const i = pipe(
    toAsync(input), // make asynchronous
    distinct(), // emit unique numbers
    delay(1000) // delay each value by 1s
);

(async function () {
    for await (const a of i) {
        console.log(a); //=> 1, 2, 3, 4 (with 1s delay)
    }
})();
```

_See also..._

-   [API List] below, plus [Full API]
-   [Recipes], for additional operations
-   [Benchmarks], for performance comparison

## API

Function [pipe] takes an iterable, applies all specified operators to it, and returns an extended iterable.

#### <i>Standard operators:</i>

All standard operators implement the same logic as [Array] does:

-   [concat](http://vitaly-t.github.io/iter-ops/functions/concat) - merges current iterable with multiple values,
    iterators or iterables.
-   [every](http://vitaly-t.github.io/iter-ops/functions/every) - checks if all elements pass the predicate test.
-   [filter](http://vitaly-t.github.io/iter-ops/functions/filter) - standard filter processor, filtering by predicate.
-   [flat](http://vitaly-t.github.io/iter-ops/functions/flat) - flattens/expands sub-iterable elements.
-   [flatMap](http://vitaly-t.github.io/iter-ops/functions/flatMap) - remaps + flattens sub-iterable elements.
-   [map](http://vitaly-t.github.io/iter-ops/functions/map) - standard mapping processor, remapping by predicate.
-   [reduce](http://vitaly-t.github.io/iter-ops/functions/reduce) - standard reduce processor.
-   [some](http://vitaly-t.github.io/iter-ops/functions/some) - checks if any element passes the predicate test.

#### <i>Extended operators:</i>

-   [aggregate](http://vitaly-t.github.io/iter-ops/functions/aggregate) - executes an aggregate on accumulated values -
    see [Aggregates].
-   [catchError](http://vitaly-t.github.io/iter-ops/functions/catchError) - catches iteration errors -
    see [Error Handling].
-   [count](http://vitaly-t.github.io/iter-ops/functions/count) - counts values, and produces a one-value iterable.
-   [defaultEmpty](http://vitaly-t.github.io/iter-ops/functions/defaultEmpty) - adds default to an empty iterable.
-   [distinct](http://vitaly-t.github.io/iter-ops/functions/distinct) - emits unique values, with optional key selector.
-   [drain](http://vitaly-t.github.io/iter-ops/functions/drain) - drains the iterable, and then ends it.
-   [empty](http://vitaly-t.github.io/iter-ops/functions/empty) - produces an empty iterable.
-   [first](http://vitaly-t.github.io/iter-ops/functions/first) - produces a one-value iterable, with the first emitted
    value.
-   [indexBy](http://vitaly-t.github.io/iter-ops/functions/indexBy) - emits indexed values that pass the predicate test.
-   [isEmpty](http://vitaly-t.github.io/iter-ops/functions/isEmpty) - produces a one-value iterable, indicating if the
    source is empty.
-   [last](http://vitaly-t.github.io/iter-ops/functions/last) - produces a one-value iterable, with the last emitted
    value.
-   [onEnd](http://vitaly-t.github.io/iter-ops/functions/onEnd) - notifies of the end of a successful iteration.
-   [page](http://vitaly-t.github.io/iter-ops/functions/page) - splits values into pages of fixed size (last page can be
    smaller).
-   [repeat](http://vitaly-t.github.io/iter-ops/functions/repeat) - repeats iterable values.
-   [skip](http://vitaly-t.github.io/iter-ops/functions/skip) - starts emitting values after certain count.
-   [split](http://vitaly-t.github.io/iter-ops/functions/split) - splits values into separate lists - see [Split].
-   [spread](http://vitaly-t.github.io/iter-ops/functions/spread) - spreads iterable values.
-   [start](http://vitaly-t.github.io/iter-ops/functions/start) - starts emitting, once the predicate returns a truthy
    value.
-   [stop](http://vitaly-t.github.io/iter-ops/functions/stop) - stops emitting, once the predicate returns a truthy
    value.
-   [take](http://vitaly-t.github.io/iter-ops/functions/take) - emits up to certain number of values.
-   [takeLast](http://vitaly-t.github.io/iter-ops/functions/takeLast) - emits up to certain number of the last values.
-   [tap](http://vitaly-t.github.io/iter-ops/functions/tap) - taps into each value, without changing the output.
-   [timing](http://vitaly-t.github.io/iter-ops/functions/timing) - measures timings for each value.
-   [toArray](http://vitaly-t.github.io/iter-ops/functions/toArray) - accumulates values into an array.
-   [zip](http://vitaly-t.github.io/iter-ops/functions/zip) - zips values together, into an array.

#### <i>See also:</i>

-   [Full API] - generated from code
-   [Asynchronous Operators](./src/ops/async) - specific for asynchronous iterables
-   [Recipes] - for more operations.

[api]: #api
[api list]: #api
[full api]: https://vitaly-t.github.io/iter-ops
[error handling]: https://github.com/vitaly-t/iter-ops/wiki/Error-Handling
[iterable]: https://javascript.info/iterable
[iterables]: https://javascript.info/iterable
[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[wiki]: https://github.com/vitaly-t/iter-ops/wiki
[pipe]: http://vitaly-t.github.io/iter-ops/functions/pipe
[recipes]: https://github.com/vitaly-t/iter-ops/wiki/Recipes
[state]: https://github.com/vitaly-t/iter-ops/wiki/Iteration-State
[aggregates]: https://github.com/vitaly-t/iter-ops/wiki/Aggregates
[split]: https://github.com/vitaly-t/iter-ops/wiki/Split
[benchmarks]: ./benchmarks
[asynchronous iterables]: https://github.com/vitaly-t/iter-ops/wiki/Asynchronous-Iterables
[synchronous]: https://javascript.info/iterable
[asynchronous]: https://javascript.info/async-iterators-generators#async-iterables
[rationale]: https://github.com/vitaly-t/iter-ops/wiki/Rationale
