Web Build
---------

This is in case you do not want to properly bundle the library for you project, and rather use a pre-packaged JavaScript
file.

Here we build a complete web distribution, which is shipped with the library.

## Build Steps

* Build the main project, with `npm run build`
* Build web distribution, with `npm run build` inside `web` folder.

All files will be generated in folder `../dist/web`.

## Usage

Include the distributed `iter-ops.min.js` from the package:

```html

<script src="./node_modules/iter-ops/dist/web/iter-ops.min.js"></script>
```

All library exports reside inside global `iterOps` namespace:

```js
const {pipe, map, filter} = iterOps; // importing some functions
```

Note that `map` and `gzip` files are included in distribution.
