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

We do not use any synthetic types here, like Observable in RXJS, etc.  

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
and returns a new [Iterable], extended with property `first`. See also - [WiKi].

#### <i>Standard operators:</i>

All standard operators implement the same logic as [Array] does: 

* [map] - standard remapping processor for the iterable
* [filter] - standard filter processor for the iterable
* [reduce] - executes standard `reducer` on iterable values  

#### <i>Extended operators:</i>

* `toArray()` - produces a one-value iterable, with array of all values
* `empty()` - produces an empty iterable
* `stop((value, index) => boolean)` - stops the iterable when the callback returns a truthy value
* `tap((value, index) => void)` - taps into each value, without changing the output
* `take(count)` - produces up to `count` number of elements

[Iterable]:https://javascript.info/iterable
[Iterables]:https://javascript.info/iterable
[Array]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[map]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
[filter]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
[reduce]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
[WiKi]:https://github.com/vitaly-t/iter-ops/wiki