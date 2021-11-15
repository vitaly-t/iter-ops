iter-ops
--------

* [About](#about)
* [Installation](#installation)
* [Usage](#usage)
    * [JavaScript](#javascript)
    * [TypeScript](#typescript)
* [API](#api)

## About

Basic operations on [Iterables], strictly for JavaScript native types.

![image](https://user-images.githubusercontent.com/5108906/141700616-b3271d34-55ed-4b47-a34a-fff1ae86f895.png)

We do not use any synthetic types here, like Observable in RXJS, etc. It is strictly an [Iterable] on the input,
and an [Iterable] on the output.

## Installation

```
$ npm i iter-ops
```

## Usage

Follow the usage examples below, based on your development environment.

See [WiKi] for more examples.

### JavaScript

Remapping an [Iterable] object:

```js
const {pipe, map} = require('iter-ops');

const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const i = pipe(a, map(value => ({value})));

const result = [...i];
//=> [{value: 1}, {value: 2}, ...]
```

### TypeScript

Calculating factorial of all even numbers:

```ts
import {pipe, filter, reduce} from 'iter-ops';

const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const i = pipe(a,
        filter(f => f % 2 === 0),
        reduce((p, c) => p * c)
); //=> factorial of all even numbers (one-value iterable)

const result = i.first; //=> 384 
```

## API

Function `pipe` takes an [Iterable], applies the specified sequence of operators to it,
and returns a new [Iterable], extended with property `first` (to simplify use of one-value iterables).

#### <i>Standard operators:</i>

All standard operators implement the same logic as [Array] does: 

* [concat] - merges current iterable with multiple values or iterables 
* [filter] - standard filter processor for the iterable
* [map] - standard mapping processor for the iterable
* [reduce] - executes standard `reducer`, and produces a one-value iterable  

#### <i>Extended operators:</i>

* `count()` - counts values, and produces a one-value iterable
* `empty()` - produces an empty iterable
* `start((value, index) => boolean)` - starts emitting values after the callback returns a truthy value
* `stop((value, index) => boolean)` - stops the iterable when the callback returns a truthy value
* `take(count)` - emits up to `count` number of values
* `tap((value, index) => void)` - taps into each value, without changing the output
* `toArray()` - accumulates values into an array, and produces a one-value iterable

[Iterable]:https://javascript.info/iterable
[Iterables]:https://javascript.info/iterable
[Array]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[concat]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
[filter]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
[map]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
[reduce]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
[WiKi]:https://github.com/vitaly-t/iter-ops/wiki
