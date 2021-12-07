Benchmarks
----------

Testing `iter-ops` versus the latest `rxjs`:

* We use an array of numbers as the input (`1e7` items for synchronous test and `1e6` for asynchronous)
* We first `filter` out all even numbers
* Then we `map` each value into an object
* Collecting all values into an array

**Tested with:**

* NodeJS v16.13.1
* rxjs v7.4.0
* iter-ops v0.7.1

### Test Results

![image](https://user-images.githubusercontent.com/5108906/145098065-020326cc-397c-4d9c-9192-f3a3e066563f.png)

* Testing against `rxjs` synchronous pipeline - we get ~2.3x times better performance
* Testing against `rxjs` with a single empty subscription - we get ~4.8x better performance

![image](https://user-images.githubusercontent.com/5108906/145098534-8a9c5426-aa77-40b4-9a99-64db4c713810.png)

* Testing against `rxjs` asynchronous pipeline, we get roughly the same performance
* Testing against `rxjs` with a single empty subscription - we get ~2.1x better performance

### Conclusions

This library performs about 2x faster than `rxjs` synchronous pipeline. However, just as you add a single subscription in `rxjs` (
which is inevitable with `rxjs`), it drops performance further 2.5 times. So ultimately, this library can process
syncronous iterables about 5 times faster than synchronous `rxjs`.

For asycnronous iterables, we get about the same performance against `rxjs` asyncronous pipeline, and ~2x times better real-world performance,
when we use subscriptions.

