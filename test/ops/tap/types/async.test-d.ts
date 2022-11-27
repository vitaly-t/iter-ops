import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {tap, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    tap(() => {})
);
expectType<AsyncIterableExt<number>>(test1);
