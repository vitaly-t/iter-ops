import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {pipe, aggregate} from '../../../../src/entry/sync';

declare const iterableString: Iterable<string>;

const test1 = pipe(
    iterableString,
    aggregate((v) => 1)
);
expectType<IterableExt<number>>(test1);

const test2 = pipe(
    iterableString,
    aggregate((v) => v.join())
);
expectType<IterableExt<string>>(test2);
