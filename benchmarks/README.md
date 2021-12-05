Benchmarks
----------

Testing `iter-ops` versus the latest `rxjs`:

* We use an array of `1e7` numbers as the input
* We first `filter` out all even numbers
* Then we `map` each value into an object
* Collecting all values into an array

**Tested with:**

* NodeJS v16.13.1
* rxjs v7.4.0
* iter-ops v0.6.2

### Test Results

![image](https://user-images.githubusercontent.com/5108906/144763096-9de43082-fd56-45f7-bdc0-98968eaddb27.png)

* Testing against `rxjs` pipeline - we get 2x times better performance
* Testing against `rxjs` with a single empty subscription - we get 5x better performance

### Conclusion

This library performs 2x faster than `rxjs` pipeline. However, just as you add a single subscription in `rxjs` (
which is inevitable with `rxjs`), it drops performance further 2.5 times. So ultimately, this library can process
synchronous iterables 5 times faster than `rxjs`.
