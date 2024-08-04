## Benchmarks

Testing `iter-ops` against the latest `rxjs`:

-   We use an array of numbers as the input (`1e7` items)
-   We first `filter` out all even numbers
-   Then we `map` each value into an object
-   Collecting all values into an array

**Tested with:**

-   NodeJS v20.16.0
-   rxjs v7.8.1
-   iter-ops v3.4.0

### Running Tests

Running tests separately is recommended, or else results may become skewed.

-   `npm test` - runs all tests (not recommended)
-   `npm run test:sync` - runs tests on synchronous iterables
-   `npm run test:async` - runs tests on asynchronous iterables

### Test Results

![image](https://github.com/user-attachments/assets/1ec6bff9-c849-4867-8a91-170553661dd3)

-   Testing against `rxjs` synchronous pipeline - we get ~1.85x times better performance
-   Testing against `rxjs` with a single empty subscription - we get ~4.46x better performance

![image](https://github.com/user-attachments/assets/193cc14c-92b0-4cd0-937d-6914a24b57b7)

Testing against an asynchronous source produces the result that for the most part depends on how fast the source
iterable is. This makes it difficult to test objectively. On one hand, `iter-ops`
has embedded optimization for wrapping an asynchronous iterable, so if we test that against a standard async iterable
for `rxjs`, we get the result as above:

- Testing against `rxjs` asynchronous pipeline, we went from ~7x better performance (in RxJs v6) to ~0.5x performance
  against the latest RxJs v7.
- Testing against `rxjs` with a single empty subscription - we went from ~15x better performance (in RxJs v6), to just ~2x
  better performance against the latest RxJs v7

The above points at tremendous performance optimizations done in v7 of RxJs.
