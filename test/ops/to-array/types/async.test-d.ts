import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {toArray, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, toArray());
expectType<AsyncIterableExt<number[]>>(test1);
