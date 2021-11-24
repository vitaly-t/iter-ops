iter-ops
--------

* [About](#about)
* [Installation](#installation)
* [Usage](#usage)
    * [JavaScript](#javascript)
    * [TypeScript](#typescript)
* [API]

## About

Basic operations on synchronous [Iterables], strictly for JavaScript native types.

![image](https://user-images.githubusercontent.com/5108906/142058291-b39d7226-56a4-4df0-8dc1-2ff2c6c18f10.png)

We do not use any synthetic types / wrappers here, like `Observable` in RXJS, etc. It is strictly a
synchronous [Iterable] on the input, and a synchronous [Iterable] on the output, for maximum performance, simplicity and
compatibility.

## Installation

```
$ npm i iter-ops
```

## Usage

Follow the usage examples below, based on your development environment.

_See also:_ official [API] below, plus [Recipes] for additional operations.

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
an [IterableExt](https://github.com/vitaly-t/iter-ops/blob/main/src/types.ts#L25).

#### <i>Standard operators:</i>

All standard operators implement the same logic as [Array] does:

* [concat] - merges current iterable with multiple values, iterators or iterables.
* [filter] - standard filter processor, extended for [state] support.
* [map] - standard mapping processor, extended for [state] support.
* [reduce] - `reduce` processor (with [state] support), which produces a one-value iterable.

#### <i>Extended operators:</i>

* `aggregate((values) => newValue)` - executes an aggregate function on accumulated values - see [Aggregates].
* `catchError((error, ctx) => void)` - catches iteration errors - see [Error Handling].
* `count()` - counts values, and produces a one-value iterable.
* `defaultEmpty(value | iterator | iterable)` - adds default to an empty iterable.
* `distinct(?(value, index) => key)` - emits unique values, with optional key selector.
* `empty()` - produces an empty iterable.
* `isEmpty()` - produces a one-value iterable, indicating if the source is empty.
* `last(?(value, index) => boolean)` - produces a one-value iterable, with the last emitted value. When optional
  predicate is provided, the last value satisfying it will be emitted.
* `skip(count)` - starts emitting values after `count` number of values;
    - it is equivalent to `start((_, index) => index >= count)`
* `spread()` - spreads iterable values.
* `start((value, index, state) => boolean)` - starts emitting, once the predicate returns a truthy value.
* `stop((value, index, state) => boolean)` - stops emitting, once the predicate returns a truthy value.
* `take(count)` - emits up to `count` number of values;
    - it is equivalent to `stop((_, index) => index >= count)`
* `takeLast(count)` - emits up to `count` number of the last values.
* `tap((value, index, state) => void)` - taps into each value, without changing the output.
* `toArray()` - accumulates values into an array, and produces a one-value iterable.

See [Recipes] for more operations.

[API]:#api

[Error Handling]:https://github.com/vitaly-t/iter-ops/wiki/Error-Handling

[Iterable]:https://javascript.info/iterable

[Iterables]:https://javascript.info/iterable

[Array]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

[concat]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat

[filter]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

[map]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

[reduce]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce

[WiKi]:https://github.com/vitaly-t/iter-ops/wiki

[pipe]:https://github.com/vitaly-t/iter-ops/blob/main/src/pipe.ts

[Recipes]:https://github.com/vitaly-t/iter-ops/wiki/Recipes

[state]:https://github.com/vitaly-t/iter-ops/wiki/Iteration-State

[Aggregates]:https://github.com/vitaly-t/iter-ops/wiki/Aggregates
