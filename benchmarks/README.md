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

-   Testing against `rxjs` synchronous pipeline - we get ~2.5x times better performance
-   Testing against `rxjs` with a single empty subscription - we get ~5x better performance

![image](https://github.com/user-attachments/assets/193cc14c-92b0-4cd0-937d-6914a24b57b7)

Testing against an asynchronous source produces the result that for the most part depends on how fast the source
iterable is. This makes it difficult to test objectively. On one hand, `iter-ops`
has embedded optimization for wrapping an asynchronous iterable, so if we test that against a standard async iterable
for `rxjs`, we get the result as above:

-   Testing against `rxjs` asynchronous pipeline, we get ~7x times better performance
-   Testing against `rxjs` with a single empty subscription - we get ~15x better performance

However, if we optimize the source iterable similar to how `iter-ops` does it, then figures become very comparative.

### Conclusions

This library performs about 2.5x faster than `rxjs` synchronous pipeline. However, just as you add a single subscription
in `rxjs` (
which is inevitable with `rxjs`), then `iter-ops` performance is about 5x times better. So ultimately, this library can
process synchronous iterables about 5x times faster than synchronous `rxjs`.

For the asynchronous test, even though we do have very impressive results versus `rxjs`, those for the most part depend
on how fast the source iterable is. Library `iter-ops` does come with some good performance optimization for wrapping
asynchronous iterables, which we achieve by using [toAsync]. However, it is possible to optimize an iterable for `rxjs`
separately. Therefore, it is nearly impossible to draw the line, in how to define an objective test for this.

[toAsync]: https://vitaly-t.github.io/iter-ops/functions/toAsync
