iter-ops
--------

* [About](#about)
* [Installation](#installation)
* [Usage](#usage)
    * [JavaScript](#javascript)
    * [TypeScript](#typescript)
* [API]

## About

Basic operations on [Iterables], strictly for JavaScript native types.

![image](https://user-images.githubusercontent.com/5108906/142058291-b39d7226-56a4-4df0-8dc1-2ff2c6c18f10.png)

We do not use any synthetic types / wrappers here, like `Observable` in RXJS, etc. It is strictly an
[Iterable] on the input, and an [Iterable] on the output, for maximum performance, simplicity and compatibility.

We also do not use ES6 generators internally, because their current implementation in V8 is relatively slow.

**NOTE:** Support for [Asynchronous Iterables] was added in v0.7.0

## Installation

```
$ npm i iter-ops
```

## Usage

Follow the usage examples below, based on your development environment.

_See also..._

* [Official API] below
* [Recipes], for additional operations
* [Benchmarks], for performance comparison

For web usage, either bundle it properly, or see [web](./web) folder.

### JavaScript

Simple filtering + mapping an [Iterable]:

```js
const {pipe, filter, map} = require('iter-ops');

const a = [1, 2, 3, 4, 5];

const i = pipe(
    a,
    filter(a => a % 2 === 0), // find even numbers
    map(value => ({value})) // remap into objects
);

const result = [...i]; //=> [{value: 2}, {value: 4}]
```

### TypeScript

Calculating the sum of unique numbers:

```ts
import {pipe, distinct, reduce} from 'iter-ops';

const a = [1, 2, 2, 3, 3, 4];

const i = pipe(
    a,
    distinct(), // emit unique numbers
    reduce((p, c) => p + c) // sum up the numbers
); //=> one-value iterable

const result = i.first; //=> 10
```

## API

Function [pipe] takes an [Iterable], applies all specified operators to it, and returns
[IterableExt](https://github.com/vitaly-t/iter-ops/blob/main/src/types.ts#L25).

#### <i>Standard operators:</i>

All standard operators implement the same logic as [Array] does:

* [concat](./src/ops/concat.ts) - merges current iterable with multiple values, iterators or iterables.
* [filter](./src/ops/filter.ts) - standard filter processor, extended for [state] support.
* [map](./src/ops/map.ts) - standard mapping processor, extended for [state] support.
* [reduce](./src/ops/reduce.ts) - `reduce` processor (with [state] support), which produces a one-value iterable.

#### <i>Extended operators:</i>

* [aggregate(values => result)](./src/ops/aggregate.ts) - executes an aggregate on accumulated values - see [Aggregates]
  .
* [catchError((error, ctx) => void)](./src/ops/catch-error.ts) - catches iteration errors - see [Error Handling].
* [count()](./src/ops/count.ts) - counts values, and produces a one-value iterable.
* [defaultEmpty(value | iterator | iterable)](./src/ops/default-empty.ts) - adds default to an empty iterable.
* [distinct(?(value, index) => key)](./src/ops/distinct.ts) - emits unique values, with optional key selector.
* [empty()](./src/ops/empty.ts) - produces an empty iterable.
* [isEmpty()](./src/ops/is-empty.ts) - produces a one-value iterable, indicating if the source is empty.
* [last(?(value, index) => boolean)](./src/ops/last.ts) - produces a one-value iterable, with the last emitted value.
  When optional predicate is provided, the last value satisfying it will be emitted.
* [page(size)](./src/ops/page.ts) - splits values into pages of fixed size (last page can be smaller).
    - equivalent 1: `split((_, index) => index.list >= size, {carryEnd: 1})`
    - equivalent 2: `split((_, index) => index.list >= size - 1, {carryEnd: -1})`
* [skip(count)](./src/ops/skip.ts) - starts emitting values after `count` number of values;
    - it is equivalent to `start((_, index) => index >= count)`
* [split(predicate, options)](./src/ops/split.ts) - splits values into separate lists, based on predicate - see [Split].
* [spread()](./src/ops/spread.ts) - spreads iterable values.
* [start((value, index, state) => boolean)](./src/ops/start.ts) - starts emitting, once the predicate returns a truthy
  value.
* [stop((value, index, state) => boolean)](./src/ops/stop.ts) - stops emitting, once the predicate returns a truthy
  value.
* [take(count)](./src/ops/take.ts) - emits up to `count` number of values;
    - it is equivalent to `stop((_, index) => index >= count)`
* [takeLast(count)](./src/ops/take-last.ts) - emits up to `count` number of the last values.
* [tap((value, index, state) => void)](./src/ops/tap.ts) - taps into each value, without changing the output.
* [toArray()](./src/ops/to-array.ts) - accumulates values into an array, and produces a one-value iterable.

See also:

* [Asynchronous Operators](./src/ops/async) - specific for asynchronous iterables
* [Recipes] - for more operations.

[API]:#api

[Official API]:#api

[Error Handling]:https://github.com/vitaly-t/iter-ops/wiki/Error-Handling

[Iterable]:https://javascript.info/iterable

[Iterables]:https://javascript.info/iterable

[Array]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

[WiKi]:https://github.com/vitaly-t/iter-ops/wiki

[pipe]:https://github.com/vitaly-t/iter-ops/blob/main/src/pipe.ts

[Recipes]:https://github.com/vitaly-t/iter-ops/wiki/Recipes

[state]:https://github.com/vitaly-t/iter-ops/wiki/Iteration-State

[Aggregates]:https://github.com/vitaly-t/iter-ops/wiki/Aggregates

[Split]:https://github.com/vitaly-t/iter-ops/wiki/Split

[Benchmarks]:./benchmarks

[Asynchronous Iterables]:https://github.com/vitaly-t/iter-ops/wiki/Asynchronous-Iterables
