Async Operators
---------------

Here we have operators that can only be added to an asynchronous pipeline.

Adding these to a synchronous pipeline will throw an iteration-time error, i.e. it can be handled with `catchError`.

### EXAMPLE

Below is a fairly complex example of using asynchronous iterables. Its purpose is mainly to show how several
asynchronous operators can be used in combination.

**Task**

* We have a list of URL-s, from which we want to fetch some data
* Data from each URL must be requested in consecutive order (not in parallel)
* When it fails for a URL, must retry 3 times for it, with delays of 1s, 3s and 5s
* Report basic confirmation of the data received from each URL
* Each URL that ultimately failed, must be reported

**Inputs**

Here we define inputs for our task:

```ts
const urls = [
    'http://ip.jsontest.com',
    'https://api.github.com/users/mralexgray/repos',
    'http://www.invalidaddress.ops' // this one will fail
];

const delays = [1000, 3000, 5000]; // delays for each retry, in ms
```

**Implementation**

Below we use a third-party module `axios` that makes an HTTP request, and returns a promise.

```ts
import {pipe, map, filter, repeat, retry, toAsync, wait} from 'iter-ops';
import * as axios from 'axios';

const i = pipe(
    toAsync(urls), // make asynchronous
    map(url => ({url, data: null})), // make trackable
    repeat((value, _, count) => !value.data && count < delays.length),
    map(a => a.data ? null : axios.get(a.url)
        .then(data => {
            a.data = data;
            return data;
        })
    ),
    filter(a => !!a), // remove null-s from above
    wait(), // resolve all promises
    retry((index, attempts) => new Promise(resolve => {
        setTimeout(() => resolve(attempts < delays.length), delays[attempts]);
    }))
).catch((err, ctx) => {
    console.log('Ultimately failed for url:', urls[ctx.index]);
    //=> Ultimately failed for url: http://www.invalidaddress.ops
});
```

**Running**

```ts
for await(const a of i) {
    console.log(a?.data?.length || a?.data);
}
```

**Explanation**

Here's what we are doing above, step by step...

1. `toAsync(urls)` - since we are working with asynchronous operators here, we need our source to be
asynchronous also, and so we use `toAsync` function to convert our synchronous iterable into asynchronous.
2. Next, we use `map`, to convert string values into objects with target data, so it can be easily tracked
through operators that follow.
3. Because we make use of `retry` logic below, it is important to understand that iterables can only go from
start till end, and when a failed operator is asked to re-try, it is re-asking the value from the source,
so unless repeated, it will be a new value, and not one for which it failed. That's why we are using `repeat`,
to keep repeating values while there is no `data` set, and we still have retry attempts left.
4. Next, we `map` our objects from step 2 into requests, and set property `data` when successful. However,
since our requests are asynchronous, it may end up requesting data twice, and so we return `null` in those cases.
5. Next, `filter` - we throw away any `null` that the previous operator may have created.
6. `wait()` - resolves every promise in the pipeline into value, since our `map` above produced a bunch of promises.
7. `retry` - we set up our retries, from the list of `delays`
8. We add `catch` error handler in the end - see [Error Handling].


[Error Handling]:https://github.com/vitaly-t/iter-ops/wiki/Error-Handling
