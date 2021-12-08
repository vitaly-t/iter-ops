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
* iter-ops v0.7.4

### Running Tests

Running tests separately is recommended, or else results may become skewed.

* `npm run sync` - runs tests on synchronous iterables
* `npm run async` - runs tests on asynchronous iterables
* `npm test` - runs all tests (not recommended)

### Test Results

![image](https://user-images.githubusercontent.com/5108906/145146801-59b8c576-54a5-4913-8482-b2b4cb4b4259.png)

* Testing against `rxjs` synchronous pipeline - we get ~2.3x times better performance
* Testing against `rxjs` with a single empty subscription - we get ~4.9x better performance

![image](https://user-images.githubusercontent.com/5108906/145146437-ae121032-058b-4adb-a500-5d2f28a79883.png)

* Testing against `rxjs` asynchronous pipeline, we get roughly the same performance
* Testing against `rxjs` with a single empty subscription - we get ~2x better performance

### Conclusions

This library performs about 2x faster than `rxjs` synchronous pipeline. However, just as you add a single subscription in `rxjs` (
which is inevitable with `rxjs`), it drops performance further 2.5 times. So ultimately, this library can process
syncronous iterables about 5 times faster than synchronous `rxjs`.

For asycnronous iterables, we get about the same performance against `rxjs` asyncronous pipeline, and ~2x times better real-world performance,
when we use subscriptions.

