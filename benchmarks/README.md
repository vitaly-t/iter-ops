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
* iter-ops v0.9.3

### Running Tests

Running tests separately is recommended, or else results may become skewed.

* `npm run sync` - runs tests on synchronous iterables
* `npm run async` - runs tests on asynchronous iterables
* `npm test` - runs all tests (not recommended)

### Test Results

![image](https://user-images.githubusercontent.com/5108906/146110938-246e612a-8e38-45f4-bf85-c10e2e100fc7.png)

* Testing against `rxjs` synchronous pipeline - we get ~2.3x times better performance
* Testing against `rxjs` with a single empty subscription - we get ~4.9x better performance

![image](https://user-images.githubusercontent.com/5108906/146110969-d436a200-4f94-4a20-9336-8db0e6306336.png)

* Testing against `rxjs` asynchronous pipeline, we get roughly the same performance
* Testing against `rxjs` with a single empty subscription - we get ~2x better performance

### Conclusions

This library performs about 2x faster than `rxjs` synchronous pipeline. However, just as you add a single subscription in `rxjs` (
which is inevitable with `rxjs`), it drops performance further 2.5 times. So ultimately, this library can process
syncronous iterables about 5 times faster than synchronous `rxjs`.

For asycnronous iterables, we get about the same performance against `rxjs` asyncronous pipeline, and ~2x times better real-world performance,
when we use subscriptions.

