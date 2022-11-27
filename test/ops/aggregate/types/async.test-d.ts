import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {pipe, aggregate} from '../../../../src/entry/async';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(
    iterableString,
    aggregate((v) => 1)
);
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipe(
    iterableString,
    aggregate((v) => v.join())
);
expectType<AsyncIterableExt<string>>(test2);

const test3 = pipe(
    iterableString,
    aggregate(async (v) => v.join())
);
expectType<AsyncIterableExt<string>>(test3);
