```ts
import {pipe, split} from 'iter-ops';

const input = [0, 1, 2, 3, 1, 4, 5];

const i = pipe(
    input,
    split((value, index) => {
        return value === 1;
    }, {carryEnd: -1})
);

console.log([...i]);
```

For regular split, carryStart is supposed to have no effect, because we are always looking at the end of the range as
the split criteria.

* carryEnd work for 1 and -1.
* carryStart is correctly ignored.

In all, the entire carry logic works correctly for split.

---

## toggle

**works:**

* carryStart forward
* carryEnd back + forward

**doesn't work:**

* carryStart back - fails to carry the toggle-start value into the previous/initial array

```ts
import {pipe, split} from 'iter-ops';

const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const i = pipe(
    input,
    split(value => {
        return value === 1 || value === 4 || value === 5 || value === 9;
    }, {toggle: true, carryStart: -1})
);

console.log([...i]); //=> [ [ 1, 2, 3 ], [ 5, 6, 7, 8 ] ]

// expected: [ [1], [ 2, 3 ], [5], [ 6, 7, 8 ] ]
```

However, this means we cannot emit array when toggle stops, because the nest toggle range will start with the value tp
be carried back. This all doesn't make much sense. Why carry back something that represents beginning of the new block?
