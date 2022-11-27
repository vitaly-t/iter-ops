import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {pipe, skipWhile} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    skipWhile((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
