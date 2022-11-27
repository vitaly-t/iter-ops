import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {some, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    some((value) => true)
);
expectType<AsyncIterableExt<boolean>>(test1);
