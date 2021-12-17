iter-ops
--------

* [About](#about)
* [Installation](#installation)
* [Usage](#usage)
    * [JavaScript](#javascript)
    * [TypeScript](#typescript)
* [API]

## About

Basic operations on [synchronous] + [asynchronous] iterables, strictly for JavaScript native types.

![image](https://user-images.githubusercontent.com/5108906/142058291-b39d7226-56a4-4df0-8dc1-2ff2c6c18f10.png)

We do not use any synthetic types / wrappers here, like `Observable` in RXJS, etc. It is strictly an iterable on the
input, and an iterable on the output, for maximum performance, simplicity and compatibility (see [Rationale]).

## Installation

```
$ npm i iter-ops
```

## Usage

Follow the usage examples below, based on your development environment.

_See also..._

* [API List] below, plus [Full API]
* [Recipes], for additional operations
* [Benchmarks], for performance comparison

For web usage, either bundle it properly, or see [web](./web) folder.

### JavaScript

Simple filtering + mapping an iterable:

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

Function [pipe] takes an iterable, applies all specified operators to it, and returns an extended iterable.

#### <i>Standard operators:</i>

All standard operators implement the same logic as [Array] does:

* [concat](http://vitaly-t.github.io/iter-ops/index.html#concat) - merges current iterable with multiple values,
  iterators or iterables.
* [every](http://vitaly-t.github.io/iter-ops/index.html#every) - checks if all elements pass the predicate test.
* [filter](http://vitaly-t.github.io/iter-ops/index.html#filter) - standard filter processor, filtering by predicate.
* [map](http://vitaly-t.github.io/iter-ops/index.html#map) - standard mapping processor, remapping by predicate.
* [reduce](http://vitaly-t.github.io/iter-ops/index.html#reduce) - standard reduce processor.
* [some](http://vitaly-t.github.io/iter-ops/index.html#some) - checks if any element passes the predicate test.

#### <i>Extended operators:</i>

* [aggregate](http://vitaly-t.github.io/iter-ops/index.html#aggregate) - executes an aggregate on accumulated values -
  see [Aggregates].
* [catchError](http://vitaly-t.github.io/iter-ops/index.html#catchError) - catches iteration errors -
  see [Error Handling].
* [count](http://vitaly-t.github.io/iter-ops/index.html#count) - counts values, and produces a one-value iterable.
* [defaultEmpty](http://vitaly-t.github.io/iter-ops/index.html#defaultEmpty) - adds default to an empty iterable.
* [distinct](http://vitaly-t.github.io/iter-ops/index.html#distinct) - emits unique values, with optional key selector.
* [drain](http://vitaly-t.github.io/iter-ops/index.html#drain) - drains the iterable, and then ends it.
* [empty](http://vitaly-t.github.io/iter-ops/index.html#empty) - produces an empty iterable.
* [indexBy](http://vitaly-t.github.io/iter-ops/index.html#indexBy) - emits indexed values that pass the predicate test.
* [isEmpty](http://vitaly-t.github.io/iter-ops/index.html#isEmpty) - produces a one-value iterable, indicating if the
  source is empty.
* [last](http://vitaly-t.github.io/iter-ops/index.html#last) - produces a one-value iterable, with the last emitted
  value.
* [onEnd](http://vitaly-t.github.io/iter-ops/index.html#onEnd) - notifies of the end of a successful iteration.
* [page](http://vitaly-t.github.io/iter-ops/index.html#page) - splits values into pages of fixed size (last page can be
  smaller).
* [repeat](http://vitaly-t.github.io/iter-ops/index.html#repeat) - repeats iterable values.
* [skip](http://vitaly-t.github.io/iter-ops/index.html#skip) - starts emitting values after certain count.
* [split](http://vitaly-t.github.io/iter-ops/index.html#split) - splits values into separate lists - see [Split].
* [spread](http://vitaly-t.github.io/iter-ops/index.html#spread) - spreads iterable values.
* [start](http://vitaly-t.github.io/iter-ops/index.html#start) - starts emitting, once the predicate returns a truthy
  value.
* [stop](http://vitaly-t.github.io/iter-ops/index.html#stop) - stops emitting, once the predicate returns a truthy
  value.
* [take](http://vitaly-t.github.io/iter-ops/index.html#take) - emits up to certain number of values.
* [takeLast](http://vitaly-t.github.io/iter-ops/index.html#takeLast) - emits up to certain number of the last values.
* [tap](http://vitaly-t.github.io/iter-ops/index.html#tap) - taps into each value, without changing the output.
* [timing](http://vitaly-t.github.io/iter-ops/index.html#timing) - measures timings for each value.
* [toArray](http://vitaly-t.github.io/iter-ops/index.html#toArray) - accumulates values into an array.

#### <i>See also:</i>

* [Full API] - generated from code
* [Asynchronous Operators](./src/ops/async) - specific for asynchronous iterables
* [Recipes] - for more operations.

[API]:#api

[API List]:#api

[Full API]:https://vitaly-t.github.io/iter-ops

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

[synchronous]:https://javascript.info/iterable

[asynchronous]:https://javascript.info/async-iterators-generators#async-iterables

[Rationale]:https://github.com/vitaly-t/iter-ops/wiki/Rationale
