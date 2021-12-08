Async Operators
---------------

Here we have operators that can only be added to an asynchronous pipeline.

Adding these to a synchronous pipeline will throw an iteration-time error, i.e. it can be handled
with `catchError`.
