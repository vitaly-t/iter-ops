Async Operators
---------------

Here we have operators that can only be added to an asynchronous pipeline.

Adding these to a synchronous pipeline will throw an iteration-time error, i.e. it can be handled with `catchError`.

**EXAMPLE**

Below is a fairly complex example of using asynchronous iterables...

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
